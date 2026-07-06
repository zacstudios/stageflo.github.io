import { createClient } from "npm:@supabase/supabase-js@2";

const TOTAL_FREE_SPOTS = 100;
const CACHE_TTL_MS = 60_000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=60",
};

let cachedCount: { count: number; fetchedAt: number } | null = null;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }

  const now = Date.now();
  let count: number;

  if (cachedCount && now - cachedCount.fetchedAt < CACHE_TTL_MS) {
    count = cachedCount.count;
  } else {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: "Supabase service configuration is missing" }, 500);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { count: rowCount, error } = await supabase
      .from("download_leads")
      .select("*", { count: "exact", head: true });

    if (error || rowCount === null) {
      return json({ error: "Failed to load count" }, 500);
    }

    count = rowCount;
    cachedCount = { count, fetchedAt: now };
  }

  return json({
    ok: true,
    claimed: Math.min(count, TOTAL_FREE_SPOTS),
    total: TOTAL_FREE_SPOTS,
    remaining: Math.max(0, TOTAL_FREE_SPOTS - count),
    soldOut: count >= TOTAL_FREE_SPOTS,
  });
});
