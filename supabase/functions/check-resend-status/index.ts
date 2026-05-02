/**
 * check-resend-status — internal one-shot function.
 * Reads all stored Resend message IDs from download_leads,
 * fetches live status from the Resend API for each, and returns a report.
 * Protected by ADMIN_API_KEY header (x-admin-key).
 */
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-key",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const adminApiKey = Deno.env.get("ADMIN_API_KEY");
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!adminApiKey || !resendApiKey || !supabaseUrl || !serviceRoleKey) {
    return json({ error: "Required environment variables are missing" }, 500);
  }

  // Accept either the admin API key (x-admin-key header) or the service role key (Authorization header).
  // This allows local/CI calls using the service role key while the web admin uses ADMIN_API_KEY.
  const incomingAdminKey = request.headers.get("x-admin-key")?.trim() ?? "";
  const incomingBearerToken = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  const isAdminKeyValid = Boolean(incomingAdminKey) && incomingAdminKey === adminApiKey;
  const isServiceRoleKeyValid = Boolean(incomingBearerToken) && incomingBearerToken === serviceRoleKey;

  if (!isAdminKeyValid && !isServiceRoleKeyValid) {
    return json({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: rows, error: dbErr } = await supabase
    .from("download_leads")
    .select("id,email,name,email_status,email_provider_message_id,email_sent_at")
    .neq("email_provider_message_id", "")
    .order("email_sent_at", { ascending: false });

  if (dbErr) {
    return json({ error: "DB query failed", detail: dbErr.message }, 500);
  }

  const results = [];

  for (const row of rows ?? []) {
    try {
      const res = await fetch(`https://api.resend.com/emails/${row.email_provider_message_id}`, {
        headers: { Authorization: `Bearer ${resendApiKey}` },
      });
      const body = await res.json().catch(() => ({}));

      // Resend returns `last_event` on their email object
      const resendStatus = body?.last_event ?? body?.status ?? "unknown";
      const events: string[] = Array.isArray(body?.events)
        ? body.events.map((e: Record<string, unknown>) => String(e?.name ?? e?.type ?? e))
        : [];

      results.push({
        email: row.email,
        name: row.name,
        resend_id: row.email_provider_message_id,
        db_status: row.email_status,
        resend_status: resendStatus,
        events,
        subject: body?.subject ?? null,
        sent_at: row.email_sent_at,
        resend_http: res.status,
      });
    } catch (err) {
      results.push({
        email: row.email,
        name: row.name,
        resend_id: row.email_provider_message_id,
        db_status: row.email_status,
        resend_status: "fetch_error",
        events: [],
        error: String(err),
        sent_at: row.email_sent_at,
      });
    }
  }

  // Build summary by resend_status
  const summary: Record<string, number> = {};
  for (const r of results) {
    const k = String(r.resend_status);
    summary[k] = (summary[k] ?? 0) + 1;
  }

  return json({
    ok: true,
    total: results.length,
    summary,
    results,
  });
});
