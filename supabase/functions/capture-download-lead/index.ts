import { createClient } from "npm:@supabase/supabase-js@2";

type LeadPayload = {
  name?: string;
  email?: string;
  marketingOptIn?: boolean;
  consent?: boolean;
  source?: "desktop" | "resource";
  downloadUrl?: string;
  page?: string;
  submittedAt?: string;
  userAgent?: string;
};

type SendEmailResult = {
  ok: boolean;
  status: "sent" | "failed" | "skipped";
  provider: "resend";
  providerMessageId: string;
  errorMessage: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_IP_PER_WINDOW = 30;
const MAX_REQUESTS_PER_EMAIL_PER_WINDOW = 5;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

const STAGEFLO_HOME_URL = "https://stageflo.app/";
const STAGEFLO_DOCS_URL = "https://stageflo.app/docs/introduction/";
const STAGEFLO_TROUBLESHOOTING_URL = "https://stageflo.app/docs/introduction/#installation-troubleshooting";
const STAGEFLO_FEEDBACK_URL = "https://stageflo.app/feedback/";
const STAGEFLO_BUG_REPORT_URL = "https://stageflo.app/feedback/?type=bug";
const STAGEFLO_FEATURE_REQUEST_URL = "https://stageflo.app/feedback/?type=feature";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const firstForwarded = forwarded.split(",")[0]?.trim();
  if (firstForwarded) return firstForwarded;
  return request.headers.get("cf-connecting-ip")?.trim() || "unknown";
}

function isRateLimited(key: string, limit: number, windowMs = RATE_LIMIT_WINDOW_MS): boolean {
  const now = Date.now();
  const current = rateLimitBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  current.count += 1;
  if (current.count > limit) {
    return true;
  }

  return false;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildThankYouEmailHtml(payload: Required<Pick<LeadPayload, "name" | "downloadUrl">>) {
  const safeName = escapeHtml(payload.name);
  const safeDownloadUrl = escapeHtml(payload.downloadUrl);

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
                  <h1 style="margin:8px 0 0;font-size:24px;line-height:1.2;color:#ffffff;">Welcome to StageFlo</h1>
                </td>
              </tr>

              <tr>
                <td style="padding:24px;background:#ffffff;">
                  <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:#111827;">Hi ${safeName},</p>
                  <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">Thanks for trying StageFlo. Start with one simple flow: create your plan, add songs and scripture, then run a full preview before service.</p>

                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
                    <tr>
                      <td>
                        <a href="${safeDownloadUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#7c3aed;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;">Start Setup Flow</a>
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
                      <span style="color:#94a3b8;"> | </span>
                      <a href="${STAGEFLO_TROUBLESHOOTING_URL}" style="color:#6d28d9;text-decoration:none;font-weight:700;">Troubleshooting</a>
                      <span style="color:#94a3b8;"> | </span>
                      <a href="${STAGEFLO_DOCS_URL}" style="color:#6d28d9;text-decoration:none;font-weight:700;">Docs</a>
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

async function sendThankYouEmail(payload: Required<Pick<LeadPayload, "email" | "name" | "downloadUrl">>): Promise<SendEmailResult> {
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
      to: [payload.email],
      subject: "Welcome to StageFlo: your download is ready",
      html: buildThankYouEmailHtml(payload),
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

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "Supabase service configuration is missing" }, 500);
  }

  const clientIp = getClientIp(request);
  if (isRateLimited(`ip:${clientIp}`, MAX_REQUESTS_PER_IP_PER_WINDOW)) {
    return json({ error: "Too many requests" }, 429);
  }

  let payload: LeadPayload;

  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim().toLowerCase() ?? "";
  const source = payload.source ?? "desktop";
  const downloadUrl = payload.downloadUrl?.trim() ?? "";
  const page = payload.page?.trim() ?? "";
  const submittedAt = payload.submittedAt ?? new Date().toISOString();
  const userAgent = payload.userAgent?.trim() || request.headers.get("user-agent") || "";
  const referrer = request.headers.get("referer") || "";

  if (name.length < 2 || name.length > 80) {
    return json({ error: "Name must be between 2 and 80 characters" }, 400);
  }

  if (!isValidEmail(email)) {
    return json({ error: "Email address is invalid" }, 400);
  }

  if (isRateLimited(`email:${email}`, MAX_REQUESTS_PER_EMAIL_PER_WINDOW)) {
    return json({ error: "Too many requests" }, 429);
  }

  if (source !== "desktop" && source !== "resource") {
    return json({ error: "Source is invalid" }, 400);
  }

  if (!downloadUrl) {
    return json({ error: "Download URL is required" }, 400);
  }

  if (!payload.consent) {
    return json({ error: "Consent is required" }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: insertedLead, error } = await supabase
    .from("download_leads")
    .upsert(
      {
        name,
        email,
        marketing_opt_in: Boolean(payload.marketingOptIn),
        consent: true,
        source,
        download_url: downloadUrl,
        page,
        submitted_at: submittedAt,
        user_agent: userAgent,
        referrer,
        email_status: "pending",
        email_provider: "resend",
      },
      { onConflict: "email", ignoreDuplicates: true }
    )
    .select("id")
    .maybeSingle();

  if (error) {
    return json({ error: "Failed to store lead" }, 500);
  }

  // Email already registered — return download URL without resending welcome email
  if (!insertedLead) {
    return json({ ok: true, accepted: true, emailQueued: true, emailStatus: "accepted" });
  }

  const emailResult = await sendThankYouEmail({ email, name, downloadUrl });
  const attemptAt = new Date().toISOString();

  await supabase
    .from("download_leads")
    .update({
      email_status: emailResult.status,
      email_attempt_count: 1,
      email_last_attempt_at: attemptAt,
      email_sent_at: emailResult.ok ? attemptAt : null,
      email_error: emailResult.errorMessage,
      email_provider: emailResult.provider,
      email_provider_message_id: emailResult.providerMessageId,
    })
    .eq("id", insertedLead.id);

  await supabase
    .from("email_events")
    .insert({
      lead_id: insertedLead.id,
      email,
      event_family: "welcome",
      event_name: "welcome_email",
      status: emailResult.status,
      provider: emailResult.provider,
      provider_message_id: emailResult.providerMessageId,
      error_message: emailResult.errorMessage,
      attempted_at: attemptAt,
      metadata: {
        source,
      },
    });

  return json({ ok: true, accepted: true, emailQueued: true, emailStatus: "accepted" });
});