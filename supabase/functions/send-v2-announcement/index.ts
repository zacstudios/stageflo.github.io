/**
 * send-v2-announcement — one-shot broadcast for StageFlo 2.0 feature release.
 *
 * Sends an announcement email about Remote Stage View + AI Semantic Search
 * to every lead who opted in to marketing emails and has not yet received
 * this announcement.
 *
 * Protected by ADMIN_API_KEY (x-admin-key header).
 *
 * Query params:
 *   ?dry_run=true   — preview count without sending anything
 *   ?batch=50       — how many leads to process per invocation (default 50, max 200)
 *
 * The function is idempotent: leads are stamped with v2_announcement_sent_at
 * so re-running skips anyone already sent.
 */
import { createClient } from "npm:@supabase/supabase-js@2";

type LeadRow = {
  id: string;
  name: string;
  email: string;
};

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
const STAGEFLO_MAC_DOWNLOAD_URL =
  "https://github.com/zacstudios/stageflo.github.io/releases/download/v2.0.0/stageflo-2.0.0.dmg";
const STAGEFLO_WIN_DOWNLOAD_URL =
  "https://github.com/zacstudios/stageflo.github.io/releases/download/v2.0.0/stageflo-2.0.0-setup.exe";
const STAGEFLO_FEEDBACK_URL = "https://stageflo.app/feedback/";

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

function buildAnnouncementEmailHtml(lead: Pick<LeadRow, "name">) {
  const safeName = escapeHtml(lead.name);

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>StageFlo 2.0 is here</title></head>
<body style="margin:0;padding:0;background:#0c101e;font-family:Arial,Helvetica,sans-serif;color:#f1f5f9;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="background:#0c101e;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="max-width:620px;background:#121a2f;border:1px solid rgba(124,58,237,0.45);border-radius:14px;overflow:hidden;">

          <!-- ── Header ── -->
          <tr>
            <td style="padding:22px 28px;background:linear-gradient(135deg,#9333ea 0%,#7c3aed 48%,#5b21b6 100%);">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#ddd6fe;font-weight:700;">
                What&rsquo;s new in StageFlo
              </p>
              <h1 style="margin:0;font-size:26px;line-height:1.2;color:#ffffff;font-weight:800;">
                Version 2.0 is here ✦
              </h1>
            </td>
          </tr>

          <!-- ── Body ── -->
          <tr>
            <td style="padding:26px 28px 0;">
              <p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#f1f5f9;">
                Hi ${safeName},
              </p>
              <p style="margin:0 0 22px;font-size:15px;line-height:1.75;color:#cbd5e1;">
                StageFlo 2.0 ships two features we&rsquo;ve been quietly building for months.
                Both are free and live right now.
              </p>

              <!-- ── Feature 1: AI Search ── -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                     style="margin:0 0 16px;border:1px solid rgba(124,58,237,0.38);border-radius:12px;overflow:hidden;background:rgba(124,58,237,0.08);">
                <tr>
                  <td style="padding:4px 14px;background:linear-gradient(135deg,rgba(124,58,237,0.55),rgba(109,40,217,0.4));">
                    <p style="margin:0;font-size:10px;letter-spacing:0.09em;text-transform:uppercase;color:#e9d5ff;font-weight:700;">
                      New &mdash; AI Feature
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 8px;font-size:16px;font-weight:800;color:#f1f5f9;">
                      ✦ &nbsp;AI Semantic Search
                    </p>
                    <p style="margin:0 0 12px;font-size:14px;line-height:1.7;color:#cbd5e1;">
                      Search your Bible and song library by <em>meaning</em>, not just exact words.
                      Type a theme, story, or feeling &mdash; StageFlo finds the right passages
                      and songs across every language you work in. Fully offline, no account needed.
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:3px 11px;border-radius:999px;border:1px solid rgba(196,181,253,0.35);background:rgba(18,26,47,0.8);font-family:monospace;font-size:12px;color:#a78bfa;">
                          &ldquo;women at the well&rdquo; &rarr; John 4:1&ndash;26
                        </td>
                      </tr>
                    </table>
                    <br>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:3px 11px;border-radius:999px;border:1px solid rgba(196,181,253,0.35);background:rgba(18,26,47,0.8);font-family:monospace;font-size:12px;color:#a78bfa;">
                          &ldquo;ദൈവ സ്നേഹം&rdquo; &rarr; Malayalam songs
                        </td>
                      </tr>
                    </table>
                    <p style="margin:14px 0 0;font-size:13px;color:#94a3b8;">
                      Works in English, Malayalam, Hindi, Tamil, Telugu &amp; more.
                      117&thinsp;MB model runs in-process &mdash; no Ollama, no internet.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- ── Feature 2: Remote Stage View ── -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                     style="margin:0 0 24px;border:1px solid rgba(56,189,248,0.38);border-radius:12px;overflow:hidden;background:rgba(14,116,144,0.08);">
                <tr>
                  <td style="padding:4px 14px;background:linear-gradient(135deg,rgba(14,116,144,0.55),rgba(3,105,161,0.4));">
                    <p style="margin:0;font-size:10px;letter-spacing:0.09em;text-transform:uppercase;color:#67e8f9;font-weight:700;">
                      New &mdash; Remote Feature
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 8px;font-size:16px;font-weight:800;color:#f1f5f9;">
                      📡 &nbsp;Remote Stage View over the Internet
                    </p>
                    <p style="margin:0 0 12px;font-size:14px;line-height:1.7;color:#cbd5e1;">
                      One click generates a secure public URL for your stage display and remote
                      controller &mdash; shareable with musicians or speakers anywhere in the world.
                      No account, no port-forwarding, no static IP. The tunnel is created on demand
                      via Cloudflare and disappears when you close the app.
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 14px;border-radius:8px;background:rgba(12,16,30,0.7);border:1px solid rgba(56,189,248,0.2);font-size:13px;color:#67e8f9;line-height:1.6;">
                          Stage display &bull; Remote controller &bull; Live slide sync
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- ── Reinstall notice ── -->
              <div style="margin:0 0 20px;padding:14px 16px;border-radius:10px;background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.3);">
                <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#fef08a;">&#128260; &nbsp;Already using StageFlo?</p>
                <p style="margin:0;font-size:13px;line-height:1.65;color:#94a3b8;">
                  StageFlo doesn&rsquo;t auto-update yet &mdash; please <strong style="color:#cbd5e1;">download and reinstall</strong> to get version 2.0 and all the new features above.
                </p>
              </div>

              <!-- ── Download CTA ── -->
              <p style="margin:0 0 14px;font-size:15px;font-weight:700;color:#f1f5f9;">
                &#11015;&#65039; &nbsp;Get 2.0 &mdash; it&rsquo;s free
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 6px;">
                <tr>
                  <td style="padding-right:10px;">
                    <a href="${STAGEFLO_MAC_DOWNLOAD_URL}"
                       style="display:inline-block;padding:11px 20px;border-radius:999px;background:#7c3aed;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;">
                      &#63743; &nbsp;Download for Mac
                    </a>
                  </td>
                  <td>
                    <a href="${STAGEFLO_WIN_DOWNLOAD_URL}"
                       style="display:inline-block;padding:11px 20px;border-radius:999px;background:rgba(124,58,237,0.22);border:1px solid rgba(196,181,253,0.35);color:#e9d5ff;text-decoration:none;font-weight:700;font-size:13px;">
                      &#128442; &nbsp;Download for Windows
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:8px 0 24px;font-size:12px;color:#64748b;">
                Or visit <a href="${STAGEFLO_HOME_URL}" style="color:#c4b5fd;text-decoration:none;">stageflo.app</a>
              </p>

              <!-- ── Feedback nudge ── -->
              <div style="margin:0 0 22px;padding:14px 16px;border-radius:10px;background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.22);">
                <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#ddd6fe;">Got feedback?</p>
                <p style="margin:0;font-size:13px;line-height:1.65;color:#94a3b8;">
                  We ship fast and iterate on real usage. Tell us what&rsquo;s working and
                  what&rsquo;s missing &mdash;
                  <a href="${STAGEFLO_FEEDBACK_URL}" style="color:#c4b5fd;text-decoration:none;font-weight:700;">share your thoughts here</a>.
                </p>
              </div>

              <p style="margin:0 0 26px;font-size:12px;line-height:1.6;color:#475569;">
                You&rsquo;re receiving this because you opted in to product updates when you
                downloaded StageFlo. We keep emails rare and relevant.
              </p>
            </td>
          </tr>

          <!-- ── Footer ── -->
          <tr>
            <td style="padding:16px 28px;border-top:1px solid rgba(124,58,237,0.22);background:#0f1424;">
              <p style="margin:0;font-size:12px;color:#64748b;">
                StageFlo &mdash;
                <a href="${STAGEFLO_HOME_URL}" style="color:#c4b5fd;text-decoration:none;">stageflo.app</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

async function sendAnnouncementEmail(
  lead: LeadRow,
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
      subject: "StageFlo 2.0: AI Search + Remote Stage View over the internet",
      html: buildAnnouncementEmailHtml(lead),
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

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  const adminApiKey = Deno.env.get("ADMIN_API_KEY");
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const resendFrom = Deno.env.get("RESEND_FROM_EMAIL");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!adminApiKey || !resendApiKey || !resendFrom || !supabaseUrl || !serviceRoleKey) {
    return json({ error: "Required environment variables are missing" }, 500);
  }

  const incomingKey = request.headers.get("x-admin-key")?.trim() ?? "";
  const incomingBearer = (request.headers.get("authorization") ?? "")
    .replace(/^Bearer\s+/i, "")
    .trim();

  const authorized =
    (Boolean(incomingKey) && incomingKey === adminApiKey) ||
    (Boolean(incomingBearer) && incomingBearer === serviceRoleKey);

  if (!authorized) {
    return json({ error: "Unauthorized" }, 401);
  }

  // ── Params ────────────────────────────────────────────────────────────────
  const url = new URL(request.url);
  const dryRun = url.searchParams.get("dry_run") === "true";
  const batchParam = Number(url.searchParams.get("batch") ?? "50");
  const batchSize = Number.isFinite(batchParam)
    ? Math.min(Math.max(batchParam, 1), 200)
    : 50;

  // ── DB ────────────────────────────────────────────────────────────────────
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: leads, error: dbErr } = await supabase
    .from("download_leads")
    .select("id, name, email")
    .eq("marketing_opt_in", true)
    .is("v2_announcement_sent_at", null)
    .order("created_at", { ascending: true })
    .limit(batchSize);

  if (dbErr) {
    return json({ error: "DB query failed", detail: dbErr.message }, 500);
  }

  const rows = (leads ?? []) as LeadRow[];

  if (dryRun) {
    return json({
      dry_run: true,
      eligible_in_batch: rows.length,
      batch_size: batchSize,
      note: "No emails sent. Remove ?dry_run=true to send.",
    });
  }

  // ── Send ──────────────────────────────────────────────────────────────────
  let sent = 0;
  let failed = 0;
  const errors: { email: string; error: string }[] = [];

  for (const lead of rows) {
    const result = await sendAnnouncementEmail(lead, resendApiKey, resendFrom);

    const now = new Date().toISOString();

    if (result.ok) {
      await supabase
        .from("download_leads")
        .update({ v2_announcement_sent_at: now })
        .eq("id", lead.id);
      sent++;
    } else {
      errors.push({ email: lead.email, error: result.errorMessage });
      failed++;
    }

    // Respect Resend rate limits: ~10 req/s on paid, 2/s on free.
    // 120 ms gap stays safely under 8/s regardless of tier.
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  return json({
    ok: true,
    sent,
    failed,
    batch_size: batchSize,
    remaining_hint: rows.length === batchSize
      ? "There may be more leads. Call again to process the next batch."
      : "All eligible leads in this batch processed.",
    errors: errors.length > 0 ? errors : undefined,
  });
});
