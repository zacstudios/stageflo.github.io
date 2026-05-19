import { createClient } from "npm:@supabase/supabase-js@2";

type AppInstallation = {
  install_id: string;
  first_seen_at: string;
  last_seen_at: string;
  first_version: string;
  last_version: string;
  launch_count: number;
  platform: string;
  arch: string;
  electron_version: string;
  node_version: string;
  app_name: string;
  is_packaged: boolean;
  tunnel_mode: string | null;
  tunnel_active: boolean;
  tunnel_hostname: string | null;
};

type UsageSummary = {
  totalInstalls: number;
  active24h: number;
  active7d: number;
  active30d: number;
  launchCountSum: number;
  averageLaunchesPerInstall: number;
  versionCounts: Array<{ version: string; installs: number }>;
  platformCounts: Array<{ platform: string; installs: number }>;
  tunnelModeCounts: Array<{ mode: string; installs: number }>;
  tunnelActiveCount: number;
  dailyActive: Array<{ day: string; installs: number }>;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-key",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
}

function clampInteger(value: string | null, fallback: number, min: number, max: number): number {
  const parsed = Number(value ?? "");
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(parsed)));
}

function normalizeText(value: string | null): string {
  return (value ?? "").trim();
}

function getEnv() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const adminApiKey = Deno.env.get("ADMIN_API_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return { error: "Supabase service configuration is missing" };
  }

  if (!adminApiKey) {
    return { error: "ADMIN_API_KEY is not configured" };
  }

  return { supabaseUrl, serviceRoleKey, adminApiKey };
}

function isAuthorized(request: Request, adminApiKey: string) {
  const key = request.headers.get("x-admin-key")?.trim();
  return Boolean(key) && key === adminApiKey;
}

function buildDailyActive(rows: AppInstallation[], days: number): Array<{ day: string; installs: number }> {
  const buckets = new Map<string, number>();
  const now = new Date();

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setUTCDate(now.getUTCDate() - i);
    const key = date.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }

  for (const row of rows) {
    const parsedTime = Date.parse(row.last_seen_at);
    if (Number.isNaN(parsedTime)) continue;
    const day = new Date(parsedTime).toISOString().slice(0, 10);
    if (!buckets.has(day)) continue;
    buckets.set(day, (buckets.get(day) ?? 0) + 1);
  }

  return Array.from(buckets.entries()).map(([day, installs]) => ({ day, installs }));
}

function buildSummary(rows: AppInstallation[], days: number): UsageSummary {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const sevenDaysMs = 7 * oneDayMs;
  const thirtyDaysMs = 30 * oneDayMs;

  let active24h = 0;
  let active7d = 0;
  let active30d = 0;
  let launchCountSum = 0;

  const versionCounts = new Map<string, number>();
  const platformCounts = new Map<string, number>();
  const tunnelModeCounts = new Map<string, number>();
  let tunnelActiveCount = 0;

  for (const row of rows) {
    const version = normalizeText(row.last_version) || "unknown";
    const platform = normalizeText(row.platform) || "unknown";
    const tunnelMode = normalizeText(row.tunnel_mode) || "none";

    versionCounts.set(version, (versionCounts.get(version) ?? 0) + 1);
    platformCounts.set(platform, (platformCounts.get(platform) ?? 0) + 1);
    tunnelModeCounts.set(tunnelMode, (tunnelModeCounts.get(tunnelMode) ?? 0) + 1);
    if (row.tunnel_active) tunnelActiveCount += 1;

    launchCountSum += Number.isFinite(row.launch_count) ? row.launch_count : 0;

    const parsedTime = Date.parse(row.last_seen_at);
    if (Number.isNaN(parsedTime)) continue;

    const ageMs = now - parsedTime;
    if (ageMs <= thirtyDaysMs) active30d += 1;
    if (ageMs <= sevenDaysMs) active7d += 1;
    if (ageMs <= oneDayMs) active24h += 1;
  }

  const totalInstalls = rows.length;

  return {
    totalInstalls,
    active24h,
    active7d,
    active30d,
    launchCountSum,
    averageLaunchesPerInstall: totalInstalls > 0 ? Number((launchCountSum / totalInstalls).toFixed(2)) : 0,
    versionCounts: Array.from(versionCounts.entries())
      .map(([version, installs]) => ({ version, installs }))
      .sort((a, b) => b.installs - a.installs || b.version.localeCompare(a.version))
      .slice(0, 20),
    platformCounts: Array.from(platformCounts.entries())
      .map(([platform, installs]) => ({ platform, installs }))
      .sort((a, b) => b.installs - a.installs || a.platform.localeCompare(b.platform)),
    tunnelModeCounts: Array.from(tunnelModeCounts.entries())
      .map(([mode, installs]) => ({ mode, installs }))
      .sort((a, b) => b.installs - a.installs || a.mode.localeCompare(b.mode)),
    tunnelActiveCount,
    dailyActive: buildDailyActive(rows, days),
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }

  const env = getEnv();

  if ("error" in env) {
    return json({ error: env.error }, 500);
  }

  if (!isAuthorized(request, env.adminApiKey)) {
    return json({ error: "Unauthorized" }, 401);
  }

  const url = new URL(request.url);
  const days = clampInteger(url.searchParams.get("days"), 30, 1, 120);
  const limit = clampInteger(url.searchParams.get("limit"), 500, 50, 5000);
  const platform = normalizeText(url.searchParams.get("platform")).toLowerCase();
  const tunnelMode = normalizeText(url.searchParams.get("tunnelMode")).toLowerCase();
  const version = normalizeText(url.searchParams.get("version")).toLowerCase();
  const queryText = normalizeText(url.searchParams.get("q")).toLowerCase();

  const supabase = createClient(env.supabaseUrl, env.serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from("app_installations")
    .select(
      "install_id,first_seen_at,last_seen_at,first_version,last_version,launch_count,platform,arch,electron_version,node_version,app_name,is_packaged,tunnel_mode,tunnel_active,tunnel_hostname"
    )
    .order("last_seen_at", { ascending: false })
    .limit(limit)
    .returns<AppInstallation[]>();

  if (error) {
    return json({ error: "Failed to load app installations" }, 500);
  }

  const rows = data ?? [];
  const filteredRows = rows.filter((row) => {
    const rowPlatform = normalizeText(row.platform).toLowerCase();
    const rowTunnelMode = normalizeText(row.tunnel_mode).toLowerCase();
    const rowVersion = normalizeText(row.last_version).toLowerCase();
    if (platform && rowPlatform !== platform) return false;
    if (tunnelMode && rowTunnelMode !== tunnelMode) return false;
    if (version && rowVersion !== version) return false;

    if (!queryText) return true;
    const haystack = [
      row.install_id,
      row.first_version,
      row.last_version,
      row.platform,
      row.tunnel_mode ?? "",
      row.tunnel_hostname ?? "",
      row.arch,
      row.node_version,
      row.electron_version,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(queryText);
  });

  return json({
    ok: true,
    days,
    limit,
    totalRows: filteredRows.length,
    sampled: rows.length === limit,
    summary: buildSummary(filteredRows, days),
    installs: filteredRows,
  });
});