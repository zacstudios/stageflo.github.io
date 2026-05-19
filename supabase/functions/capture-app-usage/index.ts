import { createClient } from "npm:@supabase/supabase-js@2";

type UsagePayload = {
  eventType?: "launch" | "heartbeat";
  installId?: string;
  installedAt?: string;
  firstVersion?: string;
  lastVersion?: string;
  launchCount?: number;
  currentVersion?: string;
  platform?: string;
  arch?: string;
  electronVersion?: string;
  nodeVersion?: string;
  packaged?: boolean;
  tunnelMode?: "named" | "quick" | null;
  tunnelActive?: boolean;
  tunnelHostname?: string;
  reportedAt?: string;
};

type AppInstallationRow = {
  id: string;
  launch_count: number;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
}

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : 1;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "Supabase service configuration is missing" }, 500);
  }

  let payload: UsagePayload;

  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const installId = normalizeText(payload.installId);
  const eventType = payload.eventType === "heartbeat" ? "heartbeat" : "launch";
  const installedAt = normalizeText(payload.installedAt);
  const firstVersion = normalizeText(payload.firstVersion);
  const lastVersion = normalizeText(payload.lastVersion) || normalizeText(payload.currentVersion);
  const currentVersion = normalizeText(payload.currentVersion) || lastVersion;
  const platform = normalizeText(payload.platform);
  const arch = normalizeText(payload.arch);
  const electronVersion = normalizeText(payload.electronVersion);
  const nodeVersion = normalizeText(payload.nodeVersion);
  const tunnelMode = payload.tunnelMode === "named" || payload.tunnelMode === "quick" ? payload.tunnelMode : null;
  const tunnelActive = Boolean(payload.tunnelActive);
  const tunnelHostname = normalizeText(payload.tunnelHostname);
  const reportedAt = normalizeText(payload.reportedAt) || new Date().toISOString();
  const launchCount = normalizeCount(payload.launchCount);

  if (!installId) {
    return json({ error: "installId is required" }, 400);
  }

  if (!installedAt) {
    return json({ error: "installedAt is required" }, 400);
  }

  if (!firstVersion) {
    return json({ error: "firstVersion is required" }, 400);
  }

  if (!lastVersion) {
    return json({ error: "currentVersion is required" }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: existingRow, error: lookupError } = await supabase
    .from("app_installations")
    .select("id, launch_count")
    .eq("install_id", installId)
    .maybeSingle<AppInstallationRow>();

  if (lookupError) {
    return json({ error: "Failed to look up installation" }, 500);
  }

  if (existingRow) {
    const nextLaunchCount =
      eventType === "launch"
        ? Math.max(existingRow.launch_count + 1, launchCount)
        : Math.max(existingRow.launch_count, launchCount);
    const { error: updateError } = await supabase
      .from("app_installations")
      .update({
        last_seen_at: reportedAt,
        last_version: lastVersion,
        launch_count: nextLaunchCount,
        platform,
        arch,
        electron_version: electronVersion,
        node_version: nodeVersion,
        app_name: "StageFlo",
        is_packaged: Boolean(payload.packaged),
        tunnel_mode: tunnelMode,
        tunnel_active: tunnelActive,
        tunnel_hostname: tunnelHostname || null,
      })
      .eq("id", existingRow.id);

    if (updateError) {
      return json({ error: "Failed to update installation" }, 500);
    }

    return json({
      ok: true,
      isNewInstall: false,
      eventType,
      installId,
      currentVersion,
      launchCount: nextLaunchCount,
    });
  }

  const { error: insertError } = await supabase.from("app_installations").insert({
    install_id: installId,
    created_at: reportedAt,
    first_seen_at: installedAt,
    last_seen_at: reportedAt,
    first_version: firstVersion,
    last_version: lastVersion,
    launch_count: launchCount,
    platform,
    arch,
    electron_version: electronVersion,
    node_version: nodeVersion,
    app_name: "StageFlo",
    is_packaged: Boolean(payload.packaged),
    tunnel_mode: tunnelMode,
    tunnel_active: tunnelActive,
    tunnel_hostname: tunnelHostname || null,
  });

  if (insertError) {
    return json({ error: "Failed to store installation" }, 500);
  }

  return json({
    ok: true,
    isNewInstall: true,
    eventType,
    installId,
    currentVersion,
    launchCount,
  });
});