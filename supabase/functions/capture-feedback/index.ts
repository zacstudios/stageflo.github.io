import { createClient } from "npm:@supabase/supabase-js@2";

type FeedbackType = "bug" | "feature" | "general";

type FeedbackPayload = {
  type?: FeedbackType;
  name?: string;
  email?: string;
  message?: string;
  platform?: string;
  appVersion?: string;
  stepsToReproduce?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  consent?: boolean;
  page?: string;
  submittedAt?: string;
  userAgent?: string;
  company?: string;
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

function normalizeType(value: string): FeedbackType {
  if (value === "bug" || value === "feature") return value;
  return "general";
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

  let payload: FeedbackPayload;

  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  if ((payload.company ?? "").trim()) {
    return json({ ok: true, accepted: false });
  }

  const type = normalizeType((payload.type ?? "general").trim().toLowerCase());
  const name = (payload.name ?? "").trim();
  const email = (payload.email ?? "").trim().toLowerCase();
  const message = (payload.message ?? "").trim();
  const platform = (payload.platform ?? "").trim();
  const appVersion = (payload.appVersion ?? "").trim();
  const stepsToReproduce = (payload.stepsToReproduce ?? "").trim();
  const expectedBehavior = (payload.expectedBehavior ?? "").trim();
  const actualBehavior = (payload.actualBehavior ?? "").trim();
  const page = (payload.page ?? "").trim();
  const submittedAt = payload.submittedAt ?? new Date().toISOString();
  const userAgent = (payload.userAgent ?? "").trim() || request.headers.get("user-agent") || "";

  if (name.length < 2 || name.length > 80) {
    return json({ error: "Name must be between 2 and 80 characters" }, 400);
  }

  if (!isValidEmail(email)) {
    return json({ error: "Email address is invalid" }, 400);
  }

  if (message.length < 10 || message.length > 4000) {
    return json({ error: "Message must be between 10 and 4000 characters" }, 400);
  }

  if (!payload.consent) {
    return json({ error: "Consent is required" }, 400);
  }

  if (platform.length > 80 || appVersion.length > 80) {
    return json({ error: "Platform and app version must be 80 characters or fewer" }, 400);
  }

  if (stepsToReproduce.length > 4000 || expectedBehavior.length > 4000 || actualBehavior.length > 4000) {
    return json({ error: "Bug detail fields must be 4000 characters or fewer" }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from("feedback_submissions")
    .insert({
      type,
      status: "new",
      source: "website",
      name,
      email,
      message,
      platform,
      app_version: appVersion,
      steps_to_reproduce: stepsToReproduce,
      expected_behavior: expectedBehavior,
      actual_behavior: actualBehavior,
      page,
      submitted_at: submittedAt,
      user_agent: userAgent,
      metadata: {
        referrer: request.headers.get("referer") || "",
      },
    })
    .select("id")
    .single();

  if (error) {
    return json({ error: "Failed to submit feedback" }, 500);
  }

  return json({ ok: true, id: data.id });
});