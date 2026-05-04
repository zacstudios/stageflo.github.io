create table if not exists public.tunnel_registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- random slug like "olive-7k3m" → hostname: olive-7k3m.stageflo.app
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{3,28}[a-z0-9]$'),
  -- Cloudflare Named Tunnel UUID returned by CF API on creation
  cf_tunnel_id text not null unique,
  -- Cloudflare tunnel credential JSON (stored encrypted at rest by Supabase)
  cf_credentials jsonb not null,
  -- Stable device fingerprint (random UUID generated once by the desktop app)
  device_id text not null unique,
  -- When this tunnel last successfully connected
  last_connected_at timestamptz
);

create index if not exists tunnel_registrations_device_id_idx
  on public.tunnel_registrations (device_id);

create index if not exists tunnel_registrations_slug_idx
  on public.tunnel_registrations (slug);

-- No public access — only service_role key (used by the Edge Function) can read/write
alter table public.tunnel_registrations enable row level security;

revoke all on public.tunnel_registrations from anon;
revoke all on public.tunnel_registrations from authenticated;
