create extension if not exists pgcrypto;

create table if not exists public.app_installations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  install_id text not null unique,
  first_seen_at timestamptz not null,
  last_seen_at timestamptz not null,
  first_version text not null,
  last_version text not null,
  launch_count integer not null default 1 check (launch_count >= 1),
  platform text not null default '',
  arch text not null default '',
  electron_version text not null default '',
  node_version text not null default '',
  app_name text not null default 'StageFlo',
  is_packaged boolean not null default true
);

create index if not exists app_installations_last_seen_at_idx
  on public.app_installations (last_seen_at desc);

create index if not exists app_installations_last_version_idx
  on public.app_installations (last_version);

alter table public.app_installations enable row level security;

revoke all on public.app_installations from anon;
revoke all on public.app_installations from authenticated;