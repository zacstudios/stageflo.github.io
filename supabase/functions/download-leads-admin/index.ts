import { createClient } from "npm:@supabase/supabase-js@2";

type RetryRequest = {
  id?: string;
};

type SendEmailResult = {
  ok: boolean;
  status: "sent" | "failed" | "skipped";
  provider: "resend";
  providerMessageId: string;
  errorMessage: string;
};

type LeadRecord = {
  id: string;
  name: string;
  email: string;
  download_url: string;
  email_attempt_count: number;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

const STAGEFLO_HOME_URL = "https://stageflo.app/";
const STAGEFLO_FEEDBACK_URL = "https://stageflo.app/feedback/";
const STAGEFLO_BUG_REPORT_URL = "https://github.com/zacstudios/Stageflo.app/issues/new?template=bug_report.md&title=Bug%3A+";
const STAGEFLO_FEATURE_REQUEST_URL = "https://github.com/zacstudios/Stageflo.app/issues/new?template=feature_request.md&title=Feature%3A+";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildThankYouEmailHtml(lead: Pick<LeadRecord, "name" | "download_url">) {
  const safeName = escapeHtml(lead.name);
  const safeDownloadUrl = escapeHtml(lead.download_url);

  return `
    <div style="margin:0;padding:0;background:#0c101e;font-family:Arial,sans-serif;color:#f1f5f9;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0c101e;padding:28px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#121a2f;border:1px solid rgba(124,58,237,0.45);border-radius:14px;overflow:hidden;">
              <tr>
                <td style="padding:20px 24px;background:linear-gradient(135deg,#9333ea 0%,#7c3aed 48%,#5b21b6 100%);">
                  <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#ddd6fe;">StageFlo Download</p>
                  <h1 style="margin:8px 0 0;font-size:24px;line-height:1.2;color:#ffffff;">Your download is ready</h1>
                </td>
              </tr>

              <tr>
                <td style="padding:24px;">
                  <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:#f1f5f9;">Hi ${safeName},</p>
                  <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#cbd5e1;">Thanks for trying StageFlo. We are excited to help your team run smoother services with lyrics, media, scripture, and stage displays from one place.</p>

                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
                    <tr>
                      <td>
                        <a href="${safeDownloadUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#7c3aed;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;">Download StageFlo</a>
                      </td>
                    </tr>
                  </table>

                  <div style="margin:0 0 18px;padding:14px;border-radius:10px;background:rgba(124,58,237,0.12);border:1px solid rgba(124,58,237,0.28);">
                    <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#ddd6fe;font-weight:700;">Help shape StageFlo</p>
                    <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:#cbd5e1;">If you spot a bug or have an idea, we want to hear it. Your feedback drives our roadmap.</p>
                    <p style="margin:0;font-size:14px;line-height:1.8;">
                      <a href="${STAGEFLO_BUG_REPORT_URL}" style="color:#c4b5fd;text-decoration:none;font-weight:700;">Report a Bug</a>
                      <span style="color:#64748b;"> | </span>
                      <a href="${STAGEFLO_FEATURE_REQUEST_URL}" style="color:#c4b5fd;text-decoration:none;font-weight:700;">Request a Feature</a>
                      <span style="color:#64748b;"> | </span>
                      <a href="${STAGEFLO_FEEDBACK_URL}" style="color:#c4b5fd;text-decoration:none;font-weight:700;">Feedback Hub</a>
                    </p>
                  </div>

                  <p style="margin:0;font-size:13px;line-height:1.6;color:#94a3b8;">You are receiving this because you requested a StageFlo download. We only use your email for product updates, support, and preferences you selected.</p>
                </td>
              </tr>

              <tr>
                <td style="padding:16px 24px;border-top:1px solid rgba(124,58,237,0.22);background:#0f1424;">
                  <p style="margin:0;font-size:12px;color:#94a3b8;">StageFlo Team</p>
                  <p style="margin:6px 0 0;font-size:12px;">
                    <a href="${STAGEFLO_HOME_URL}" style="color:#c4b5fd;text-decoration:none;">stageflo.app</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

async function sendThankYouEmail(lead: Pick<LeadRecord, "email" | "name" | "download_url">): Promise<SendEmailResult> {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const resendFrom = Deno.env.get("RESEND_FROM_EMAIL");

  if (!resendApiKey || !resendFrom) {
    return {
      ok: false,
      status: "skipped",
      provider: "resend",
      providerMessageId: "",
      errorMessage: "Resend is not configured",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFrom,
      to: [lead.email],
      subject: "Your StageFlo download",
      html: buildThankYouEmailHtml(lead),
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      ok: false,
      status: "failed",
      provider: "resend",
      providerMessageId: "",
      errorMessage: `Resend email failed with status ${response.status}`,
    };
  }

  return {
    ok: true,
    status: "sent",
    provider: "resend",
    providerMessageId: typeof data?.id === "string" ? data.id : "",
    errorMessage: "",
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const env = getEnv();

  if ("error" in env) {
    return json({ error: env.error }, 500);
  }

  if (!isAuthorized(request, env.adminApiKey)) {
    return json({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(env.supabaseUrl, env.serviceRoleKey, {
    auth: { persistSession: false },
  });

  if (request.method === "GET") {
    const url = new URL(request.url);
    const action = url.searchParams.get("action") ?? "";

    // ── Check Resend delivery status for all stored message IDs ──
    if (action === "check-resend") {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (!resendApiKey) {
        return json({ error: "RESEND_API_KEY not configured" }, 500);
      }

      const { data: rows, error: dbErr } = await supabase
        .from("download_leads")
        .select("id,email,email_status,email_provider_message_id")
        .neq("email_provider_message_id", "")
        .order("created_at", { ascending: false });

      if (dbErr) {
        return json({ error: "Failed to load leads from DB" }, 500);
      }

      const results = [];
      for (const row of rows ?? []) {
        try {
          const res = await fetch(`https://api.resend.com/emails/${row.email_provider_message_id}`, {
            headers: { Authorization: `Bearer ${resendApiKey}` },
          });
          const body = await res.json().catch(() => ({}));
          results.push({
            email: row.email,
            resend_id: row.email_provider_message_id,
            db_status: row.email_status,
            resend_status: body?.last_event ?? body?.status ?? "unknown",
            resend_events: Array.isArray(body?.events) ? body.events.map((e: Record<string, unknown>) => e?.name ?? e) : [],
            resend_http_status: res.status,
            from: body?.from ?? null,
            to: body?.to ?? null,
            subject: body?.subject ?? null,
          });
        } catch (err) {
          results.push({
            email: row.email,
            resend_id: row.email_provider_message_id,
            db_status: row.email_status,
            resend_status: "fetch_error",
            error: String(err),
          });
        }
      }

      const summary: Record<string, number> = {};
      for (const r of results) {
        const k = String(r.resend_status);
        summary[k] = (summary[k] ?? 0) + 1;
      }

      return json({ ok: true, total: results.length, summary, results });
    }

    const limitParam = Number(url.searchParams.get("limit") ?? "50");
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 50;
    const statusFilter = (url.searchParams.get("status") ?? "").trim();
    const search = (url.searchParams.get("q") ?? "").trim().toLowerCase();

    let query = supabase
      .from("download_leads")
      .select("id,created_at,name,email,source,download_url,page,email_status,email_attempt_count,email_last_attempt_at,email_sent_at,email_error,email_provider_message_id")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (statusFilter) {
      query = query.eq("email_status", statusFilter);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return json({ error: "Failed to load leads" }, 500);
    }

    return json({ ok: true, leads: data ?? [] });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let payload: RetryRequest;

  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const leadId = payload.id?.trim() ?? "";

  if (!leadId) {
    return json({ error: "Lead id is required" }, 400);
  }

  const { data: lead, error: leadError } = await supabase
    .from("download_leads")
    .select("id,name,email,download_url,email_attempt_count")
    .eq("id", leadId)
    .single<LeadRecord>();

  if (leadError || !lead) {
    return json({ error: "Lead not found" }, 404);
  }

  const emailResult = await sendThankYouEmail(lead);
  const attemptAt = new Date().toISOString();
  const nextAttemptCount = (lead.email_attempt_count ?? 0) + 1;

  const { error: updateError } = await supabase
    .from("download_leads")
    .update({
      email_status: emailResult.status,
      email_attempt_count: nextAttemptCount,
      email_last_attempt_at: attemptAt,
      email_sent_at: emailResult.ok ? attemptAt : null,
      email_error: emailResult.errorMessage,
      email_provider: emailResult.provider,
      email_provider_message_id: emailResult.providerMessageId,
    })
    .eq("id", lead.id);

  if (updateError) {
    return json({ error: "Failed to update retry status" }, 500);
  }

  return json({
    ok: true,
    emailQueued: emailResult.ok,
    emailStatus: emailResult.status,
    attempts: nextAttemptCount,
  });
});
