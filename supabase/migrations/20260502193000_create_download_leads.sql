create extension if not exists pgcrypto;

create table if not exists public.download_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(trim(name)) between 2 and 80),
  email text not null check (char_length(trim(email)) between 5 and 320),
  marketing_opt_in boolean not null default false,
  consent boolean not null default false,
  source text not null check (source in ('desktop', 'resource')),
  download_url text not null,
  page text not null default '',
  submitted_at timestamptz not null,
  user_agent text not null default '',
  referrer text not null default ''
);

create index if not exists download_leads_created_at_idx
  on public.download_leads (created_at desc);

create index if not exists download_leads_email_idx
  on public.download_leads (lower(email));

alter table public.download_leads enable row level security;

revoke all on public.download_leads from anon;
revoke all on public.download_leads from authenticated;