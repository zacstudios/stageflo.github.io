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

type EmailEventStatus = "pending" | "sent" | "failed" | "skipped";

type EmailEventRecord = {
  id: string;
  lead_id: string;
  event_name: string;
  status: EmailEventStatus;
  attempted_at: string;
  provider: string;
  provider_message_id: string;
  error_message: string;
};

type AppInstallRecord = {
  install_id: string;
  last_version: string;
  last_seen_at: string;
};

type UsageSummary = {
  totalInstalls: number;
  active7d: number;
  active30d: number;
  versionCounts: Array<{ version: string; installs: number }>;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

const STAGEFLO_HOME_URL = "https://stageflo.app/";
const STAGEFLO_FEEDBACK_URL = "https://stageflo.app/feedback/";
const STAGEFLO_BUG_REPORT_URL = "https://stageflo.app/feedback/?type=bug";
const STAGEFLO_FEATURE_REQUEST_URL = "https://stageflo.app/feedback/?type=feature";

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

function buildUsageSummary(rows: AppInstallRecord[]): UsageSummary {
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  let active7d = 0;
  let active30d = 0;
  const versionCounts = new Map<string, number>();

  for (const row of rows) {
    const parsedTime = Date.parse(row.last_seen_at);
    const version = row.last_version?.trim() || "unknown";

    versionCounts.set(version, (versionCounts.get(version) ?? 0) + 1);

    if (!Number.isNaN(parsedTime)) {
      const ageMs = now - parsedTime;
      if (ageMs <= thirtyDaysMs) active30d += 1;
      if (ageMs <= sevenDaysMs) active7d += 1;
    }
  }

  return {
    totalInstalls: rows.length,
    active7d,
    active30d,
    versionCounts: Array.from(versionCounts.entries())
      .map(([version, installs]) => ({ version, installs }))
      .sort((a, b) => b.installs - a.installs || b.version.localeCompare(a.version)),
  };
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
    <div style="margin:0;padding:0;background:#eef2ff;font-family:Arial,sans-serif;color:#111827;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2ff;padding:28px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid #ddd6fe;border-radius:14px;overflow:hidden;">
              <tr>
                <td style="padding:20px 24px;background:linear-gradient(135deg,#9333ea 0%,#7c3aed 48%,#5b21b6 100%);">
                  <p style="margin:0 0 8px;">
                    <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#ede9fe;border:1px solid #c4b5fd;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#4c1d95;font-weight:700;">StageFlo Download</span>
                  </p>
                  <h1 style="margin:8px 0 0;font-size:24px;line-height:1.2;color:#ffffff;">Your download is ready</h1>
                </td>
              </tr>

              <tr>
                <td style="padding:24px;background:#ffffff;">
                  <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:#111827;">Hi ${safeName},</p>
                  <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">Thanks for trying StageFlo. We are excited to help your team run smoother services with lyrics, media, scripture, and stage displays from one place.</p>

                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
                    <tr>
                      <td>
                        <a href="${safeDownloadUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#7c3aed;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;">Download StageFlo</a>
                      </td>
                    </tr>
                  </table>

                  <div style="margin:0 0 18px;padding:14px;border-radius:10px;background:#f5f3ff;border:1px solid #ddd6fe;">
                    <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#5b21b6;font-weight:700;">Help shape StageFlo</p>
                    <p style="margin:0 0 10px;font-size:14px;line-height:1.65;color:#374151;">If you spot a bug or have an idea, we want to hear it. Your feedback drives our roadmap.</p>
                    <p style="margin:0;font-size:14px;line-height:1.8;">
                      <a href="${STAGEFLO_BUG_REPORT_URL}" style="color:#6d28d9;text-decoration:none;font-weight:700;">Report a Bug</a>
                      <span style="color:#94a3b8;"> | </span>
                      <a href="${STAGEFLO_FEATURE_REQUEST_URL}" style="color:#6d28d9;text-decoration:none;font-weight:700;">Request a Feature</a>
                      <span style="color:#94a3b8;"> | </span>
                      <a href="${STAGEFLO_FEEDBACK_URL}" style="color:#6d28d9;text-decoration:none;font-weight:700;">Feedback Hub</a>
                    </p>
                  </div>

                  <p style="margin:0;font-size:13px;line-height:1.6;color:#4b5563;">You are receiving this because you requested a StageFlo download. We only use your email for product updates, support, and preferences you selected.</p>
                </td>
              </tr>

              <tr>
                <td style="padding:16px 24px;border-top:1px solid #e2e8f0;background:#f8fafc;">
                  <p style="margin:0;font-size:12px;color:#4b5563;">StageFlo Team</p>
                  <p style="margin:6px 0 0;font-size:12px;">
                    <a href="${STAGEFLO_HOME_URL}" style="color:#6d28d9;text-decoration:none;">stageflo.app</a>
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
    const limitParam = Number(url.searchParams.get("limit") ?? "50");
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 50;
    const statusFilter = (url.searchParams.get("status") ?? "").trim();
    const search = (url.searchParams.get("q") ?? "").trim().toLowerCase();

    let query = supabase
      .from("download_leads")
      .select("id,created_at,name,email,source,download_url,page,email_status,email_attempt_count,email_last_attempt_at,email_sent_at,email_error,email_provider_message_id,onboarding_step_2_sent_at,onboarding_step_3_sent_at,onboarding_step_4_sent_at,onboarding_sequence_completed_at,onboarding_attempt_count,onboarding_last_attempt_at,onboarding_last_error")
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

    const { data: installRows, error: usageError } = await supabase
      .from("app_installations")
      .select("install_id,last_version,last_seen_at")
      .limit(10000)
      .returns<AppInstallRecord[]>();

    if (usageError) {
      return json({ error: "Failed to load usage summary" }, 500);
    }

    const leadIds = (data ?? []).map((row) => String(row.id));
    let eventsByLead: Record<string, EmailEventRecord[]> = {};

    if (leadIds.length > 0) {
      const { data: events, error: eventsError } = await supabase
        .from("email_events")
        .select("id,lead_id,event_name,status,attempted_at,provider,provider_message_id,error_message")
        .in("lead_id", leadIds)
        .order("attempted_at", { ascending: false })
        .limit(1000)
        .returns<EmailEventRecord[]>();

      if (eventsError) {
        return json({ error: "Failed to load email events" }, 500);
      }

      for (const event of events ?? []) {
        const key = String(event.lead_id);
        if (!eventsByLead[key]) {
          eventsByLead[key] = [];
        }
        if (eventsByLead[key].length < 5) {
          eventsByLead[key].push(event);
        }
      }
    }

    return json({
      ok: true,
      leads: data ?? [],
      usage: buildUsageSummary(installRows ?? []),
      eventsByLead,
    });
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

  await supabase
    .from("email_events")
    .insert({
      lead_id: lead.id,
      email: lead.email,
      event_family: "resend",
      event_name: "welcome_resend",
      status: emailResult.status,
      provider: emailResult.provider,
      provider_message_id: emailResult.providerMessageId,
      error_message: emailResult.errorMessage,
      attempted_at: attemptAt,
      metadata: {
        source: "download-leads-admin",
      },
    });

  return json({
    ok: true,
    emailQueued: emailResult.ok,
    emailStatus: emailResult.status,
    attempts: nextAttemptCount,
  });
});
