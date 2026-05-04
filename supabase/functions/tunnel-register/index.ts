/**
 * tunnel-register Edge Function
 *
 * Called by the desktop app on first launch (or after credentials are lost).
 * It:
 *   1. Checks if this device_id already has a registration → returns it (idempotent)
 *   2. Otherwise generates a random biblical slug (adjective + noun + 4-char hex)
 *   3. Creates a Cloudflare Named Tunnel via the CF API
 *   4. Creates a DNS CNAME  <slug>.stageflo.app → <tunnel-id>.cfargotunnel.com
 *   5. Stores everything in tunnel_registrations and returns the credentials + slug
 *
 * Required Supabase secrets (set via `supabase secrets set`):
 *   CF_ACCOUNT_ID        — Cloudflare account ID
 *   CF_ZONE_ID           — Zone ID for stageflo.app
 *   CF_API_TOKEN         — Token with Cloudflare Tunnel:Edit + DNS:Edit for stageflo.app
 *   SUPABASE_SERVICE_ROLE_KEY  — auto-available in Edge Functions
 *   SUPABASE_URL               — auto-available in Edge Functions
 */

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-device-id",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Content-Type": "application/json",
};

// ── Biblical adjectives + nouns for friendly slug generation ─────────────────
const ADJECTIVES = [
  "blessed", "holy", "living", "ancient", "golden", "faithful", "humble",
  "eternal", "mighty", "gentle", "graceful", "peaceful", "sacred", "radiant",
  "risen", "chosen", "bright", "pure", "joyful", "tender",
];

const NOUNS = [
  "olive", "cedar", "jordan", "zion", "grace", "shalom", "psalm",
  "bethel", "canaan", "eden", "glory", "covenant", "chapel", "haven",
  "spring", "altar", "refuge", "vine", "lamb", "dove",
];

function generateSlug(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const suffix = Math.random().toString(16).slice(2, 6); // 4-char hex
  return `${adj}-${noun}-${suffix}`;
}

// ── Slug guards ──────────────────────────────────────────────────────────────

/** DNS-level reserved names that must never be used as subdomains. */
const RESERVED_SLUGS = new Set([
  "www", "api", "app", "mail", "smtp", "pop", "imap", "ftp", "sftp",
  "ssh", "cdn", "static", "assets", "media", "img", "images", "files",
  "upload", "uploads", "download", "downloads", "admin", "administrator",
  "root", "superuser", "support", "help", "docs", "status", "staging",
  "dev", "develop", "development", "test", "testing", "beta", "alpha",
  "demo", "sandbox", "preview", "internal", "intranet", "vpn", "proxy",
  "ns", "ns1", "ns2", "ns3", "mx", "mx1", "mx2", "autodiscover",
  "autoconfig", "webmail", "blog", "shop", "store", "pay", "payments",
  "billing", "account", "accounts", "auth", "login", "signin", "signup",
  "register", "dashboard", "panel", "cp", "cpanel", "whm", "plesk",
  "stageflo", "stageflow", "stagefloapp", "stageflo-app",
  "null", "undefined", "localhost", "local", "example", "test123",
]);

/** Substrings — if any appear anywhere in the slug, it is rejected. */
const BLOCKED_SUBSTRINGS = [
  // profanity
  "fuck", "fuk", "fck", "shit", "sht", "cunt", "cock", "dick", "piss",
  "ass", "arse", "bitch", "bastard", "wank", "twat", "slut", "whore",
  "nigger", "nigga", "faggot", "fag", "retard", "spastic", "kike",
  "chink", "spic", "wetback", "cracker", "honky",
  // hate / extremism
  "nazi", "hitler", "heil", "kkk", "jihad", "isis", "terror",
  // spam / scam signals
  "phish", "malware", "exploit", "hack", "crack",
];

/**
 * Returns a human-readable rejection reason, or null if the slug is clean.
 */
function checkSlugGuards(slug: string): string | null {
  if (RESERVED_SLUGS.has(slug)) return "reserved";
  for (const sub of BLOCKED_SUBSTRINGS) {
    if (slug.includes(sub)) return "inappropriate";
  }
  return null;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

// ── Cloudflare API helpers ───────────────────────────────────────────────────

async function cfRequest(
  path: string,
  method: string,
  body: unknown,
  token: string
): Promise<{ ok: boolean; data: unknown }> {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

async function createCfTunnel(
  accountId: string,
  token: string,
  name: string
): Promise<{ tunnelId: string; credentials: unknown }> {
  const { ok, data } = await cfRequest(
    `/accounts/${accountId}/cfd_tunnel`,
    "POST",
    { name, config_src: "cloudflare" },
    token
  ) as { ok: boolean; data: { result?: { id: string; credentials_file?: unknown } } };

  if (!ok || !data.result?.id) {
    throw new Error(`CF tunnel create failed: ${JSON.stringify(data)}`);
  }

  // Fetch the tunnel token (credentials) so cloudflared can connect
  const tokenRes = await cfRequest(
    `/accounts/${accountId}/cfd_tunnel/${data.result.id}/token`,
    "GET",
    undefined,
    token
  ) as { ok: boolean; data: { result?: string } };

  if (!tokenRes.ok) {
    throw new Error(`CF tunnel token fetch failed: ${JSON.stringify(tokenRes.data)}`);
  }

  return {
    tunnelId: data.result.id,
    credentials: { token: tokenRes.data.result },
  };
}

async function createDnsRecord(
  zoneId: string,
  token: string,
  slug: string,
  tunnelId: string
): Promise<void> {
  // Check if a CNAME already exists for this slug (e.g. from a previous failed attempt)
  const { data: listData } = await cfRequest(
    `/zones/${zoneId}/dns_records?type=CNAME&name=${slug}.stageflo.app`,
    "GET",
    undefined,
    token
  ) as { data: { result?: { id: string; content: string }[] } };

  const existing = listData.result?.[0];
  if (existing) {
    // Record exists — update it to point to the new tunnel
    const { ok, data } = await cfRequest(
      `/zones/${zoneId}/dns_records/${existing.id}`,
      "PATCH",
      {
        content: `${tunnelId}.cfargotunnel.com`,
        proxied: true,
        ttl: 1,
      },
      token
    );
    if (!ok) {
      throw new Error(`CF DNS update failed: ${JSON.stringify(data)}`);
    }
    return;
  }

  const { ok, data } = await cfRequest(
    `/zones/${zoneId}/dns_records`,
    "POST",
    {
      type: "CNAME",
      name: `${slug}.stageflo.app`,
      content: `${tunnelId}.cfargotunnel.com`,
      proxied: true,
      ttl: 1, // auto (proxied)
    },
    token
  );

  if (!ok) {
    throw new Error(`CF DNS create failed: ${JSON.stringify(data)}`);
  }
}

async function deleteCfTunnel(
  accountId: string,
  token: string,
  tunnelId: string
): Promise<void> {
  // Best-effort cleanup on rollback — ignore errors
  await cfRequest(
    `/accounts/${accountId}/cfd_tunnel/${tunnelId}`,
    "DELETE",
    undefined,
    token
  ).catch(() => {});
}

async function deleteDnsRecord(
  zoneId: string,
  token: string,
  slug: string
): Promise<void> {
  // List DNS records matching the slug CNAME, then delete each
  const { ok, data } = await cfRequest(
    `/zones/${zoneId}/dns_records?type=CNAME&name=${slug}.stageflo.app`,
    "GET",
    undefined,
    token
  ) as { ok: boolean; data: { result?: { id: string }[] } };
  if (!ok || !data.result) return;
  for (const record of data.result) {
    await cfRequest(`/zones/${zoneId}/dns_records/${record.id}`, "DELETE", undefined, token)
      .catch(() => {});
  }
}

// ── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // ── GET: Check slug availability ──────────────────────────────────────────
  if (request.method === "GET") {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug")?.trim().toLowerCase() ?? "";
    if (!slug || !/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(slug) && !/^[a-z0-9]{3,30}$/.test(slug)) {
      return json({ available: false, reason: "invalid" }, 200);
    }
    const guardReason = checkSlugGuards(slug);
    if (guardReason) return json({ available: false, reason: guardReason }, 200);
    const supabaseCheck = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { data: taken } = await supabaseCheck
      .from("tunnel_registrations")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    return json({ available: !taken });
  }

  if (request.method !== "POST" && request.method !== "DELETE") {
    return json({ error: "Method not allowed" }, 405);
  }
  const deviceId = request.headers.get("x-device-id")?.trim();
  if (!deviceId || !/^[0-9a-f-]{36}$/i.test(deviceId)) {
    return json({ error: "Missing or invalid x-device-id header" }, 400);
  }

  const cfToken = Deno.env.get("CF_API_TOKEN");
  const cfAccountId = Deno.env.get("CF_ACCOUNT_ID");
  const cfZoneId = Deno.env.get("CF_ZONE_ID");

  if (!cfToken || !cfAccountId || !cfZoneId) {
    console.error("Missing Cloudflare secrets");
    return json({ error: "Server misconfigured" }, 503);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // ── DELETE: Remove old tunnel, DNS record, and DB row ───────────────────────
  if (request.method === "DELETE") {
    const { data: reg } = await supabase
      .from("tunnel_registrations")
      .select("slug, cf_tunnel_id")
      .eq("device_id", deviceId)
      .maybeSingle();

    if (reg) {
      // Delete DNS record first, then the tunnel
      await deleteDnsRecord(cfZoneId, cfToken, reg.slug);
      await deleteCfTunnel(cfAccountId, cfToken, reg.cf_tunnel_id);
      await supabase.from("tunnel_registrations").delete().eq("device_id", deviceId);
    }

    return json({ deleted: true });
  }

  // Read optional custom slug from POST body
  let desiredSlug: string | null = null;
  try {
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const raw = typeof body?.desired_slug === "string" ? body.desired_slug.trim().toLowerCase() : "";
    if (raw) {
      // Validate format: 3-30 chars, lowercase alphanumeric + hyphens, no leading/trailing hyphen
      if (!/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(raw) && !/^[a-z0-9]{3,30}$/.test(raw)) {
        return json({ error: "Invalid subdomain: use 3-30 lowercase letters, numbers or hyphens, no leading/trailing hyphens" }, 400);
      }
      // Guard: reserved or inappropriate
      const guardReason = checkSlugGuards(raw);
      if (guardReason === "reserved") {
        return json({ error: "That subdomain name is reserved and cannot be used" }, 400);
      }
      if (guardReason === "inappropriate") {
        return json({ error: "That subdomain contains inappropriate content" }, 400);
      }
      desiredSlug = raw;
    }
  } catch { /* no body is fine */ }

  // ── 1. Idempotent: return existing registration for this device ─────────────
  const { data: existing, error: existingErr } = await supabase
    .from("tunnel_registrations")
    .select("slug, cf_tunnel_id, cf_credentials")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (existingErr) {
    console.error("DB select error (existing):", JSON.stringify(existingErr));
    return json({ error: "Database error", detail: existingErr.message, code: existingErr.code }, 500);
  }

  if (existing) {
    // Touch last_connected_at
    await supabase
      .from("tunnel_registrations")
      .update({ last_connected_at: new Date().toISOString() })
      .eq("device_id", deviceId);

    return json({
      slug: existing.slug,
      hostname: `${existing.slug}.stageflo.app`,
      tunnelId: existing.cf_tunnel_id,
      credentials: existing.cf_credentials,
    });
  }

  // ── 2. Determine slug: use desired_slug if provided, else generate ────────
  let slug = "";

  if (desiredSlug) {
    // Check if the desired slug is already taken by another device
    const { data: taken, error: takenErr } = await supabase
      .from("tunnel_registrations")
      .select("id")
      .eq("slug", desiredSlug)
      .maybeSingle();
    if (takenErr) {
      console.error("DB select error (slug check):", JSON.stringify(takenErr));
      return json({ error: "Database error", detail: takenErr.message, code: takenErr.code }, 500);
    }
    if (taken) {
      return json({ error: "That subdomain is already taken, please choose another" }, 409);
    }
    slug = desiredSlug;
  } else {
    for (let i = 0; i < 5; i++) {
      const candidate = generateSlug();
      const { data: taken } = await supabase
        .from("tunnel_registrations")
        .select("id")
        .eq("slug", candidate)
        .maybeSingle();
      if (!taken) { slug = candidate; break; }
    }
    if (!slug) {
      return json({ error: "Could not generate a unique slug" }, 503);
    }
  }

  // ── 3. Create Cloudflare Named Tunnel ────────────────────────────────────
  let tunnelId = "";
  let credentials: unknown;
  try {
    const result = await createCfTunnel(cfAccountId, cfToken, `stageflo-${slug}`);
    tunnelId = result.tunnelId;
    credentials = result.credentials;
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("CF tunnel create error:", detail);
    return json({ error: "Failed to provision tunnel", detail }, 502);
  }

  // ── 4. Create DNS record ──────────────────────────────────────────────────
  try {
    await createDnsRecord(cfZoneId, cfToken, slug, tunnelId);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("CF DNS create error:", detail);
    // Roll back the tunnel we just created
    await deleteCfTunnel(cfAccountId, cfToken, tunnelId);
    return json({ error: "Failed to create DNS record", detail }, 502);
  }

  // ── 5. Persist in DB ─────────────────────────────────────────────────────
  const { error: dbErr } = await supabase.from("tunnel_registrations").insert({
    slug,
    cf_tunnel_id: tunnelId,
    cf_credentials: credentials,
    device_id: deviceId,
    last_connected_at: new Date().toISOString(),
  });

  if (dbErr) {
    console.error("DB insert error:", JSON.stringify(dbErr));
    // Best-effort rollback
    await deleteCfTunnel(cfAccountId, cfToken, tunnelId);
    return json({ error: "Database error", detail: dbErr.message, code: dbErr.code }, 500);
  }

  return json({
    slug,
    hostname: `${slug}.stageflo.app`,
    tunnelId,
    credentials,
  });
});
