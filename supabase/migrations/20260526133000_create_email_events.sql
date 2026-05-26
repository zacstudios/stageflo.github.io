create extension if not exists pgcrypto;

create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid not null references public.download_leads(id) on delete cascade,
  email text not null check (char_length(trim(email)) between 5 and 320),
  event_family text not null,
  event_name text not null,
  step smallint check (step in (2, 3, 4) or step is null),
  status text not null check (status in ('pending', 'sent', 'failed', 'skipped')),
  provider text not null default 'resend',
  provider_message_id text not null default '',
  error_message text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  attempted_at timestamptz not null default now()
);

create index if not exists email_events_lead_attempted_at_idx
  on public.email_events (lead_id, attempted_at desc);

create index if not exists email_events_email_attempted_at_idx
  on public.email_events (lower(email), attempted_at desc);

create index if not exists email_events_event_name_attempted_at_idx
  on public.email_events (event_name, attempted_at desc);

alter table public.email_events enable row level security;

revoke all on public.email_events from anon;
revoke all on public.email_events from authenticated;
