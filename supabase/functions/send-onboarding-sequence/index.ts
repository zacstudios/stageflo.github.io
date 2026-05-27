import { createClient } from "npm:@supabase/supabase-js@2";

type LeadRow = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  download_url: string;
  consent: boolean;
  onboarding_step_2_sent_at: string | null;
  onboarding_step_3_sent_at: string | null;
  onboarding_step_4_sent_at: string | null;
  onboarding_attempt_count: number;
};

type OnboardingStep = 2 | 3 | 4;

type SendResult = {
  ok: boolean;
  providerMessageId: string;
  errorMessage: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

const STAGEFLO_HOME_URL = "https://stageflo.app/";
const STAGEFLO_DOCS_URL = "https://stageflo.app/docs/introduction/";
const STAGEFLO_TROUBLESHOOTING_URL = "https://stageflo.app/docs/introduction/#installation-troubleshooting";
const STAGEFLO_FEEDBACK_URL = "https://stageflo.app/feedback/";
const STAGEFLO_BUG_REPORT_URL = "https://stageflo.app/feedback/?type=bug";
const STAGEFLO_FEATURE_REQUEST_URL = "https://stageflo.app/feedback/?type=feature";

const DAY_MS = 24 * 60 * 60 * 1000;
const STEP_2_DELAY_MS = 1 * DAY_MS;
const STEP_3_DELAY_AFTER_STEP_2_MS = 2 * DAY_MS;
const STEP_4_DELAY_AFTER_STEP_3_MS = 3 * DAY_MS;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildEmailShell(title: string, safeName: string, bodyHtml: string, ctaText: string, ctaHref: string) {
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
                  <h1 style="margin:8px 0 0;font-size:24px;line-height:1.2;color:#ffffff;">${title}</h1>
                </td>
              </tr>

              <tr>
                <td style="padding:24px;background:#ffffff;">
                  <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:#111827;">Hi ${safeName},</p>
                  ${bodyHtml}

                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
                    <tr>
                      <td>
                        <a href="${ctaHref}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#7c3aed;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;">${ctaText}</a>
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

function buildEmailHtml(lead: Pick<LeadRow, "name" | "download_url">, step: OnboardingStep) {
  const safeName = escapeHtml(lead.name);
  const safeDownloadUrl = escapeHtml(lead.download_url);

  if (step === 2) {
    const bodyHtml = `
      <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#374151;">Most teams follow this setup pattern every week:</p>
      <ol style="margin:0 0 18px;padding-left:18px;font-size:14px;line-height:1.8;color:#374151;">
        <li>Create a plan</li>
        <li>Add songs and scripture in order</li>
        <li>Preview transitions once before service</li>
      </ol>
      <p style="margin:0 0 18px;font-size:14px;line-height:1.7;color:#4b5563;">Pro tip: create a reusable Sunday template plan and duplicate it each week.</p>
    `;
    return buildEmailShell("A simple Sunday workflow", safeName, bodyHtml, "Open StageFlo", safeDownloadUrl);
  }

  if (step === 3) {
    const bodyHtml = `
      <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#374151;">Switching tools can feel heavy. We can help you move faster:</p>
      <ul style="margin:0 0 16px;padding-left:18px;font-size:14px;line-height:1.8;color:#374151;">
        <li>Import existing songs</li>
        <li>Set preferred Bible translations</li>
        <li>Match your current visual style</li>
      </ul>
      <p style="margin:0 0 18px;font-size:14px;line-height:1.7;color:#4b5563;">Reply with MIGRATE and your current software stack.</p>
    `;
    return buildEmailShell("Need help migrating?", safeName, bodyHtml, "Get Migration Help", STAGEFLO_FEEDBACK_URL);
  }

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#374151;">This week goal: complete one full rehearsal and run one real service in StageFlo.</p>
    <ul style="margin:0 0 16px;padding-left:18px;font-size:14px;line-height:1.8;color:#374151;">
      <li>Plan created</li>
      <li>Songs and Bible added</li>
      <li>Outputs tested</li>
      <li>One full run-through completed</li>
    </ul>
  `;
  return buildEmailShell("Ready for your first live run?", safeName, bodyHtml, "Run My First Service", safeDownloadUrl);
}

function buildSubject(step: OnboardingStep) {
  if (step === 2) return "The Sunday workflow most teams use in StageFlo";
  if (step === 3) return "Moving from your current tool? We can help";
  return "Ready to run your first live service this week?";
}

async function sendOnboardingEmail(
  lead: Pick<LeadRow, "email" | "name" | "download_url">,
  step: OnboardingStep,
  resendApiKey: string,
  resendFrom: string,
): Promise<SendResult> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFrom,
      to: [lead.email],
      subject: buildSubject(step),
      html: buildEmailHtml(lead, step),
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      ok: false,
      providerMessageId: "",
      errorMessage: `Resend returned ${response.status}: ${JSON.stringify(data)}`,
    };
  }

  return {
    ok: true,
    providerMessageId: typeof data?.id === "string" ? data.id : "",
    errorMessage: "",
  };
}

function getDueStep(row: LeadRow, nowMs: number): OnboardingStep | null {
  const createdAtMs = Date.parse(row.created_at);
  if (Number.isNaN(createdAtMs)) return null;

  if (!row.onboarding_step_2_sent_at && nowMs >= createdAtMs + STEP_2_DELAY_MS) {
    return 2;
  }

  const step2SentAtMs = row.onboarding_step_2_sent_at
    ? Date.parse(row.onboarding_step_2_sent_at)
    : Number.NaN;

  if (
    row.onboarding_step_2_sent_at &&
    !row.onboarding_step_3_sent_at &&
    !Number.isNaN(step2SentAtMs) &&
    nowMs >= step2SentAtMs + STEP_3_DELAY_AFTER_STEP_2_MS
  ) {
    return 3;
  }

  const step3SentAtMs = row.onboarding_step_3_sent_at
    ? Date.parse(row.onboarding_step_3_sent_at)
    : Number.NaN;

  if (
    row.onboarding_step_3_sent_at &&
    !row.onboarding_step_4_sent_at &&
    !Number.isNaN(step3SentAtMs) &&
    nowMs >= step3SentAtMs + STEP_4_DELAY_AFTER_STEP_3_MS
  ) {
    return 4;
  }

  return null;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const adminApiKey = Deno.env.get("ADMIN_API_KEY");
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const resendFrom = Deno.env.get("RESEND_FROM_EMAIL");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!adminApiKey || !resendApiKey || !resendFrom || !supabaseUrl || !serviceRoleKey) {
    return json({ error: "Required environment variables are missing" }, 500);
  }

  const incomingAdminKey = request.headers.get("x-admin-key")?.trim() ?? "";
  const incomingBearerToken = (request.headers.get("authorization") ?? "")
    .replace(/^Bearer\s+/i, "")
    .trim();

  const isAdminKeyValid = Boolean(incomingAdminKey) && incomingAdminKey === adminApiKey;
  const isServiceRoleKeyValid = Boolean(incomingBearerToken) && incomingBearerToken === serviceRoleKey;

  if (!isAdminKeyValid && !isServiceRoleKeyValid) {
    return json({ error: "Unauthorized" }, 401);
  }

  const url = new URL(request.url);
  const dryRun = url.searchParams.get("dry_run") === "true";
  const batchParam = Number(url.searchParams.get("batch") ?? "100");
  const batchSize = Number.isFinite(batchParam)
    ? Math.min(Math.max(batchParam, 1), 500)
    : 100;

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: rows, error: dbErr } = await supabase
    .from("download_leads")
    .select("id,name,email,created_at,download_url,consent,onboarding_step_2_sent_at,onboarding_step_3_sent_at,onboarding_step_4_sent_at,onboarding_attempt_count")
    .eq("consent", true)
    .eq("email_status", "sent")
    .order("created_at", { ascending: true })
    .limit(Math.max(batchSize * 3, batchSize));

  if (dbErr) {
    return json({ error: "DB query failed", detail: dbErr.message }, 500);
  }

  const nowMs = Date.now();
  const candidates = (rows ?? [])
    .map((row) => ({ row: row as LeadRow, step: getDueStep(row as LeadRow, nowMs) }))
    .filter((item) => item.step !== null)
    .slice(0, batchSize) as Array<{ row: LeadRow; step: OnboardingStep }>;

  if (dryRun) {
    return json({
      ok: true,
      dry_run: true,
      eligible_now: candidates.length,
      batch_size: batchSize,
      sample: candidates.slice(0, 10).map((item) => ({
        id: item.row.id,
        email: item.row.email,
        step: item.step,
        created_at: item.row.created_at,
      })),
    });
  }

  let sent = 0;
  let failed = 0;
  let step2Sent = 0;
  let step3Sent = 0;
  let step4Sent = 0;
  const errors: Array<{ email: string; step: OnboardingStep; error: string }> = [];

  for (const item of candidates) {
    const nowIso = new Date().toISOString();
    const result = await sendOnboardingEmail(item.row, item.step, resendApiKey, resendFrom);

    const updatePayload: Record<string, unknown> = {
      onboarding_last_attempt_at: nowIso,
      onboarding_attempt_count: item.row.onboarding_attempt_count + 1,
      onboarding_last_error: result.errorMessage,
    };

    if (result.ok) {
      updatePayload[`onboarding_step_${item.step}_sent_at`] = nowIso;
      if (item.step === 4) {
        updatePayload.onboarding_sequence_completed_at = nowIso;
      }
      sent += 1;
      if (item.step === 2) step2Sent += 1;
      if (item.step === 3) step3Sent += 1;
      if (item.step === 4) step4Sent += 1;
    } else {
      failed += 1;
      errors.push({ email: item.row.email, step: item.step, error: result.errorMessage });
    }

    await supabase
      .from("download_leads")
      .update(updatePayload)
      .eq("id", item.row.id);

    await supabase
      .from("email_events")
      .insert({
        lead_id: item.row.id,
        email: item.row.email,
        event_family: "onboarding",
        event_name: `onboarding_step_${item.step}`,
        step: item.step,
        status: result.ok ? "sent" : "failed",
        provider: "resend",
        provider_message_id: result.providerMessageId,
        error_message: result.errorMessage,
        attempted_at: nowIso,
      });

    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  return json({
    ok: true,
    processed: candidates.length,
    sent,
    failed,
    sent_by_step: {
      step2: step2Sent,
      step3: step3Sent,
      step4: step4Sent,
    },
    errors: errors.length > 0 ? errors : undefined,
  });
});
