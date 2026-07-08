import { createClient } from "npm:@supabase/supabase-js@2";

type CrashReport = {
  installId?: string;
  sessionId?: string;
  appVersion?: string;
  platform?: string;
  arch?: string;
  electronVersion?: string;
  packaged?: boolean;
  kind?: string;
  source?: string;
  message?: string;
  stack?: string;
  occurredAt?: string;
};

type CrashPayload = CrashReport & {
  reports?: CrashReport[];
};

const MAX_REPORTS_PER_REQUEST = 20;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_STACK_LENGTH = 16000;

const ALLOWED_KINDS = new Set([
  "main-uncaught-exception",
  "main-unhandled-rejection",
  "render-process-gone",
  "child-process-gone",
  "renderer-uncaught",
  "renderer-unhandled-rejection",
  "renderer-error-boundary",
]);

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

function normalizeText(value: unknown, maxLength = 200): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizeTimestamp(value: unknown): string {
  const text = normalizeText(value, 64);
  if (!text) return new Date().toISOString();
  const parsed = Date.parse(text);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : new Date().toISOString();
}

function toRow(report: CrashReport) {
  const installId = normalizeText(report.installId, 128);
  const kind = normalizeText(report.kind, 64);

  if (!installId || !ALLOWED_KINDS.has(kind)) {
    return null;
  }

  return {
    install_id: installId,
    session_id: normalizeText(report.sessionId, 128),
    app_version: normalizeText(report.appVersion, 64),
    platform: normalizeText(report.platform, 32),
    arch: normalizeText(report.arch, 32),
    electron_version: normalizeText(report.electronVersion, 64),
    is_packaged: Boolean(report.packaged),
    kind,
    source: normalizeText(report.source, 64),
    message: normalizeText(report.message, MAX_MESSAGE_LENGTH),
    stack: normalizeText(report.stack, MAX_STACK_LENGTH),
    occurred_at: normalizeTimestamp(report.occurredAt),
  };
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

  let payload: CrashPayload;

  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const reports = Array.isArray(payload.reports) ? payload.reports : [payload];
  const rows = reports
    .slice(0, MAX_REPORTS_PER_REQUEST)
    .map((report) => toRow(report))
    .filter((row) => row !== null);

  if (rows.length === 0) {
    return json({ error: "No valid crash reports in payload" }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { error: insertError } = await supabase.from("crash_reports").insert(rows);

  if (insertError) {
    return json({ error: "Failed to store crash reports" }, 500);
  }

  return json({ ok: true, stored: rows.length });
});
