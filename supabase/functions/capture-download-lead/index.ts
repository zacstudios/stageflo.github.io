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

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
      subject: "Your StageFlo download",
      html: `
        <p>Hi ${payload.name},</p>
        <p>Thanks for your interest in StageFlo.</p>
        <p>Your download is ready here:</p>
        <p><a href="${payload.downloadUrl}">Download StageFlo</a></p>
        <p>We will use this email only for release updates, support, and the preferences you selected.</p>
      `,
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
    .insert({
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
    })
    .select("id")
    .single();

  if (error) {
    return json({ error: "Failed to store lead" }, 500);
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

  return json({ ok: true, emailQueued: emailResult.ok, emailStatus: emailResult.status });
});