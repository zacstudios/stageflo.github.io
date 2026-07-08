import { createClient } from "npm:@supabase/supabase-js@2";

type CrashRow = {
  id: string;
  created_at: string;
  install_id: string;
  session_id: string;
  app_version: string;
  platform: string;
  arch: string;
  electron_version: string;
  is_packaged: boolean;
  kind: string;
  source: string;
  message: string;
  stack: string;
  occurred_at: string;
};

type CrashGroup = {
  kind: string;
  message: string;
  hits: number;
  installs: number;
  lastSeen: string;
  versions: string[];
};

type CrashSummary = {
  totalCrashes: number;
  affectedInstalls: number;
  crashes24h: number;
  crashes7d: number;
  kindCounts: Array<{ kind: string; crashes: number }>;
  versionCounts: Array<{ version: string; crashes: number }>;
  platformCounts: Array<{ platform: string; crashes: number }>;
  dailyCrashes: Array<{ day: string; crashes: number }>;
  topGroups: CrashGroup[];
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

function buildDailyCrashes(rows: CrashRow[], days: number): Array<{ day: string; crashes: number }> {
  const buckets = new Map<string, number>();
  const now = new Date();

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setUTCDate(now.getUTCDate() - i);
    buckets.set(date.toISOString().slice(0, 10), 0);
  }

  for (const row of rows) {
    const parsedTime = Date.parse(row.created_at);
    if (Number.isNaN(parsedTime)) continue;
    const day = new Date(parsedTime).toISOString().slice(0, 10);
    if (!buckets.has(day)) continue;
    buckets.set(day, (buckets.get(day) ?? 0) + 1);
  }

  return Array.from(buckets.entries()).map(([day, crashes]) => ({ day, crashes }));
}

function buildTopGroups(rows: CrashRow[]): CrashGroup[] {
  const groups = new Map<
    string,
    { kind: string; message: string; hits: number; installs: Set<string>; lastSeen: string; versions: Set<string> }
  >();

  for (const row of rows) {
    const messageKey = row.message.slice(0, 160);
    const key = `${row.kind}::${messageKey}`;
    const existing = groups.get(key);

    if (existing) {
      existing.hits += 1;
      existing.installs.add(row.install_id);
      existing.versions.add(row.app_version || "unknown");
      if (row.created_at > existing.lastSeen) existing.lastSeen = row.created_at;
    } else {
      groups.set(key, {
        kind: row.kind,
        message: messageKey,
        hits: 1,
        installs: new Set([row.install_id]),
        lastSeen: row.created_at,
        versions: new Set([row.app_version || "unknown"]),
      });
    }
  }

  return Array.from(groups.values())
    .map((group) => ({
      kind: group.kind,
      message: group.message,
      hits: group.hits,
      installs: group.installs.size,
      lastSeen: group.lastSeen,
      versions: Array.from(group.versions).sort().slice(0, 6),
    }))
    .sort((a, b) => b.hits - a.hits || b.lastSeen.localeCompare(a.lastSeen))
    .slice(0, 15);
}

function buildSummary(rows: CrashRow[], days: number): CrashSummary {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const sevenDaysMs = 7 * oneDayMs;

  let crashes24h = 0;
  let crashes7d = 0;

  const installIds = new Set<string>();
  const kindCounts = new Map<string, number>();
  const versionCounts = new Map<string, number>();
  const platformCounts = new Map<string, number>();

  for (const row of rows) {
    installIds.add(row.install_id);

    const kind = normalizeText(row.kind) || "unknown";
    const version = normalizeText(row.app_version) || "unknown";
    const platform = normalizeText(row.platform) || "unknown";

    kindCounts.set(kind, (kindCounts.get(kind) ?? 0) + 1);
    versionCounts.set(version, (versionCounts.get(version) ?? 0) + 1);
    platformCounts.set(platform, (platformCounts.get(platform) ?? 0) + 1);

    const parsedTime = Date.parse(row.created_at);
    if (Number.isNaN(parsedTime)) continue;

    const ageMs = now - parsedTime;
    if (ageMs <= sevenDaysMs) crashes7d += 1;
    if (ageMs <= oneDayMs) crashes24h += 1;
  }

  return {
    totalCrashes: rows.length,
    affectedInstalls: installIds.size,
    crashes24h,
    crashes7d,
    kindCounts: Array.from(kindCounts.entries())
      .map(([kind, crashes]) => ({ kind, crashes }))
      .sort((a, b) => b.crashes - a.crashes || a.kind.localeCompare(b.kind)),
    versionCounts: Array.from(versionCounts.entries())
      .map(([version, crashes]) => ({ version, crashes }))
      .sort((a, b) => b.crashes - a.crashes || b.version.localeCompare(a.version))
      .slice(0, 20),
    platformCounts: Array.from(platformCounts.entries())
      .map(([platform, crashes]) => ({ platform, crashes }))
      .sort((a, b) => b.crashes - a.crashes || a.platform.localeCompare(b.platform)),
    dailyCrashes: buildDailyCrashes(rows, days),
    topGroups: buildTopGroups(rows),
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
  const limit = clampInteger(url.searchParams.get("limit"), 1000, 50, 5000);
  const kind = normalizeText(url.searchParams.get("kind")).toLowerCase();
  const platform = normalizeText(url.searchParams.get("platform")).toLowerCase();
  const version = normalizeText(url.searchParams.get("version")).toLowerCase();
  const installId = normalizeText(url.searchParams.get("installId"));
  const queryText = normalizeText(url.searchParams.get("q")).toLowerCase();

  const supabase = createClient(env.supabaseUrl, env.serviceRoleKey, {
    auth: { persistSession: false },
  });

  const sinceIso = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  let query = supabase
    .from("crash_reports")
    .select(
      "id,created_at,install_id,session_id,app_version,platform,arch,electron_version,is_packaged,kind,source,message,stack,occurred_at"
    )
    .gte("created_at", sinceIso)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (kind) query = query.eq("kind", kind);
  if (platform) query = query.eq("platform", platform);
  if (version) query = query.eq("app_version", version);
  if (installId) query = query.eq("install_id", installId);

  const { data, error } = await query;

  if (error) {
    return json({ error: "Failed to load crash reports" }, 500);
  }

  let rows = (data ?? []) as CrashRow[];

  if (queryText) {
    rows = rows.filter((row) =>
      [row.message, row.stack, row.install_id, row.session_id, row.source]
        .join(" ")
        .toLowerCase()
        .includes(queryText)
    );
  }

  return json({
    ok: true,
    sampled: (data ?? []).length >= limit,
    summary: buildSummary(rows, days),
    crashes: rows.slice(0, 300),
  });
});
