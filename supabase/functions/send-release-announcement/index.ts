/**
 * send-release-announcement — broadcast a StageFlo release to opted-in leads.
 *
 * Sends the announcement for one release (see RELEASES) to every lead who opted
 * in to marketing emails and has not yet been sent that release. Each send is
 * recorded in release_announcements, so re-running continues where it stopped.
 *
 * Protected by ADMIN_API_KEY (x-admin-key header) or the service role key.
 *
 * Query params:
 *   ?release=2.1.68         — which announcement to send (required)
 *   ?dry_run=true           — count eligible leads without sending anything
 *   ?test_to=you@example.com — send one preview to that address only; nothing is recorded
 *   ?batch=50               — leads per invocation (default 50, max 200)
 */
import { createClient } from "npm:@supabase/supabase-js@2";

type LeadRow = {
  id: string;
  name: string;
  email: string;
};

type Release = {
  subject: string;
  preheader: string;
  headline: string;
  intro: string;
  features: { title: string; body: string }[];
  howToUpdate: string[];
  downloads: { mac: string; macIntel: string; windows: string };
};

const STAGEFLO_HOME_URL = "https://stageflo.app/";
const STAGEFLO_FEEDBACK_URL = "https://stageflo.app/feedback/";

const RELEASES: Record<string, Release> = {
  "2.1.68": {
    subject: "StageFlo 2.1.68: chords, song numbers and a page for your music director",
    preheader:
      "Chords and VerseVIEW numbers for your library, a music director page, and quieter updates.",
    headline: "StageFlo 2.1.68 is here",
    intro:
      "This update brings chords and song numbers to your whole library, a new page for your music director, and updates that stay out of your way during a service.",
    features: [
      {
        title: "Chords and song numbers for your whole library",
        body:
          "Hundreds of songs now come with chords, and nearly 7,900 songs carry their VerseVIEW song number. Type a number in the song search to find the song. If your library said songs were &ldquo;kept as you edited them&rdquo; and chords never arrived, that&rsquo;s fixed: StageFlo now only holds back songs you&rsquo;ve actually changed.",
      },
      {
        title: "A page for your music director",
        body:
          "Your music director can open a link on a phone or tablet and see the live song slide by slide, with its key and BPM. They can change the key or BPM on the fly, see the service plan, and send a message to the stage. Set it up in <strong>Settings &rarr; Music Director</strong>.",
      },
      {
        title: "Updates that stay out of your way",
        body:
          "New versions download quietly in the background. When one is ready, a <strong>Restart to update</strong> button appears in the status bar. No popups during a service.",
      },
      {
        title: "Your plans keep their songs",
        body:
          "Deleting or replacing songs in your library no longer removes them from your service plans. Import a song again and the plan reconnects it automatically.",
      },
    ],
    howToUpdate: [
      "Open StageFlo. It downloads the update by itself, then shows <strong>Restart to update</strong> in the status bar. Click it when you&rsquo;re not in a service.",
      "Go to <strong>Settings &rarr; Songs &rarr; Check for updates now</strong> to bring in the new chords and song numbers straight away. Songs you&rsquo;ve edited yourself are left as they are.",
      "After updating, <strong>Help &rarr; What&rsquo;s New</strong> shows the full list of changes.",
    ],
    downloads: {
      mac: "https://github.com/zacstudios/stageflo.github.io/releases/download/v2.1.68/stageflo-2.1.68-arm64.dmg",
      macIntel:
        "https://github.com/zacstudios/stageflo.github.io/releases/download/v2.1.68/stageflo-2.1.68-x64.dmg",
      windows:
        "https://github.com/zacstudios/stageflo.github.io/releases/download/v2.1.68/stageflo-2.1.68-setup.exe",
    },
  },
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function buildEmailHtml(release: Release, name: string) {
  const greeting = name.trim() ? `Hi ${escapeHtml(name.trim())},` : "Hi there,";
  const features = release.features
    .map(
      (feature) => `
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                     style="margin:0 0 14px;border:1px solid rgba(124,58,237,0.38);border-radius:12px;background:rgba(124,58,237,0.08);">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 8px;font-size:16px;font-weight:800;color:#f1f5f9;">${feature.title}</p>
                    <p style="margin:0;font-size:14px;line-height:1.7;color:#cbd5e1;">${feature.body}</p>
                  </td>
                </tr>
              </table>`,
    )
    .join("");
  const steps = release.howToUpdate
    .map(
      (step) =>
        `<li style="margin:0 0 8px;font-size:14px;line-height:1.65;color:#cbd5e1;">${step}</li>`,
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(release.headline)}</title></head>
<body style="margin:0;padding:0;background:#0c101e;font-family:Arial,Helvetica,sans-serif;color:#f1f5f9;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(release.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0c101e;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="max-width:620px;background:#121a2f;border:1px solid rgba(124,58,237,0.45);border-radius:14px;overflow:hidden;">
          <tr>
            <td style="padding:22px 28px;background:linear-gradient(135deg,#9333ea 0%,#7c3aed 48%,#5b21b6 100%);">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#ddd6fe;font-weight:700;">
                What&rsquo;s new in StageFlo
              </p>
              <h1 style="margin:0;font-size:26px;line-height:1.2;color:#ffffff;font-weight:800;">${escapeHtml(release.headline)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:26px 28px 0;">
              <p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#f1f5f9;">${greeting}</p>
              <p style="margin:0 0 22px;font-size:15px;line-height:1.75;color:#cbd5e1;">${release.intro}</p>
              ${features}
              <p style="margin:22px 0 10px;font-size:15px;font-weight:700;color:#f1f5f9;">How to get it</p>
              <ol style="margin:0 0 22px;padding-left:20px;">${steps}</ol>
              <p style="margin:0 0 12px;font-size:14px;color:#cbd5e1;">New to StageFlo, or not updating automatically? Download it here:</p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 6px;">
                <tr>
                  <td style="padding:0 8px 8px 0;">
                    <a href="${release.downloads.mac}"
                       style="display:inline-block;padding:11px 18px;border-radius:999px;background:#7c3aed;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;">Mac (Apple silicon)</a>
                  </td>
                  <td style="padding:0 8px 8px 0;">
                    <a href="${release.downloads.macIntel}"
                       style="display:inline-block;padding:11px 18px;border-radius:999px;background:rgba(124,58,237,0.22);border:1px solid rgba(196,181,253,0.35);color:#e9d5ff;text-decoration:none;font-weight:700;font-size:13px;">Mac (Intel)</a>
                  </td>
                  <td style="padding:0 0 8px 0;">
                    <a href="${release.downloads.windows}"
                       style="display:inline-block;padding:11px 18px;border-radius:999px;background:rgba(124,58,237,0.22);border:1px solid rgba(196,181,253,0.35);color:#e9d5ff;text-decoration:none;font-weight:700;font-size:13px;">Windows</a>
                  </td>
                </tr>
              </table>
              <p style="margin:4px 0 24px;font-size:12px;color:#64748b;">
                Or visit <a href="${STAGEFLO_HOME_URL}" style="color:#c4b5fd;text-decoration:none;">stageflo.app</a>
              </p>
              <div style="margin:0 0 22px;padding:14px 16px;border-radius:10px;background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.22);">
                <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#ddd6fe;">Questions or ideas?</p>
                <p style="margin:0;font-size:13px;line-height:1.65;color:#94a3b8;">
                  Just reply to this email, or
                  <a href="${STAGEFLO_FEEDBACK_URL}" style="color:#c4b5fd;text-decoration:none;font-weight:700;">share your feedback here</a>.
                </p>
              </div>
              <p style="margin:0 0 26px;font-size:12px;line-height:1.6;color:#475569;">
                You&rsquo;re receiving this because you opted in to product updates when you
                downloaded StageFlo. We keep emails rare and relevant.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;border-top:1px solid rgba(124,58,237,0.22);background:#0f1424;">
              <p style="margin:0;font-size:12px;color:#64748b;">
                StageFlo &mdash; <a href="${STAGEFLO_HOME_URL}" style="color:#c4b5fd;text-decoration:none;">stageflo.app</a>
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

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  resendApiKey: string,
  resendFrom: string,
): Promise<{ ok: boolean; providerMessageId: string; errorMessage: string }> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: resendFrom, to: [to], subject, html }),
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

  const url = new URL(request.url);
  const releaseId = url.searchParams.get("release") ?? "";
  const release = RELEASES[releaseId];
  if (!release) {
    return json({ error: "Unknown release", known: Object.keys(RELEASES) }, 400);
  }
  const dryRun = url.searchParams.get("dry_run") === "true";
  const testTo = (url.searchParams.get("test_to") ?? "").trim();
  const batchParam = Number(url.searchParams.get("batch") ?? "50");
  const batchSize = Number.isFinite(batchParam) ? Math.min(Math.max(batchParam, 1), 200) : 50;

  // A preview goes to one address only and is not recorded against any lead.
  if (testTo) {
    if (!EMAIL_PATTERN.test(testTo)) return json({ error: "test_to is not an email address" }, 400);
    const result = await sendEmail(
      testTo,
      `[Preview] ${release.subject}`,
      buildEmailHtml(release, ""),
      resendApiKey,
      resendFrom,
    );
    return json({ preview: true, release: releaseId, ...result }, result.ok ? 200 : 502);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  const { data: alreadySent, error: sentErr } = await supabase
    .from("release_announcements")
    .select("lead_id")
    .eq("release", releaseId);
  if (sentErr) return json({ error: "DB query failed", detail: sentErr.message }, 500);
  const sentIds = new Set((alreadySent ?? []).map((row) => row.lead_id as string));

  // Only addresses whose welcome email was accepted, so known-bad addresses are skipped.
  const { data: leads, error: dbErr } = await supabase
    .from("download_leads")
    .select("id, name, email")
    .eq("marketing_opt_in", true)
    .eq("email_status", "sent")
    .order("created_at", { ascending: true });
  if (dbErr) return json({ error: "DB query failed", detail: dbErr.message }, 500);

  // One email per address, even if someone signed up twice.
  const seen = new Set<string>();
  const eligible = ((leads ?? []) as LeadRow[]).filter((lead) => {
    const address = lead.email.trim().toLowerCase();
    if (sentIds.has(lead.id) || seen.has(address)) return false;
    seen.add(address);
    return true;
  });
  const rows = eligible.slice(0, batchSize);

  if (dryRun) {
    return json({
      dry_run: true,
      release: releaseId,
      eligible: eligible.length,
      already_sent: sentIds.size,
      would_send_now: rows.length,
      note: "No emails sent. Remove dry_run=true to send.",
    });
  }

  let sent = 0;
  let failed = 0;
  const errors: { lead_id: string; error: string }[] = [];
  for (const lead of rows) {
    const result = await sendEmail(
      lead.email,
      release.subject,
      buildEmailHtml(release, lead.name ?? ""),
      resendApiKey,
      resendFrom,
    );
    if (result.ok) {
      await supabase.from("release_announcements").insert({
        lead_id: lead.id,
        release: releaseId,
        provider_message_id: result.providerMessageId,
      });
      sent++;
    } else {
      errors.push({ lead_id: lead.id, error: result.errorMessage });
      failed++;
    }
    await supabase.from("email_events").insert({
      lead_id: lead.id,
      email: lead.email,
      event_family: "announcement",
      event_name: `release_${releaseId}`,
      status: result.ok ? "sent" : "failed",
      provider: "resend",
      provider_message_id: result.providerMessageId,
      error_message: result.errorMessage,
    });
    // Stay under Resend's rate limit on any plan.
    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  return json({
    ok: true,
    release: releaseId,
    sent,
    failed,
    remaining: eligible.length - rows.length,
    errors: errors.length > 0 ? errors : undefined,
  });
});
