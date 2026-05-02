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
      html: `
        <p>Hi ${lead.name},</p>
        <p>Thanks for your interest in StageFlo.</p>
        <p>Your download is ready here:</p>
        <p><a href="${lead.download_url}">Download StageFlo</a></p>
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
