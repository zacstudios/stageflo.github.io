create extension if not exists pgcrypto;

create table if not exists public.feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  submitted_at timestamptz not null default now(),
  type text not null check (type in ('bug', 'feature', 'general')),
  status text not null default 'new' check (status in ('new', 'triaged', 'closed', 'spam')),
  source text not null default 'website',
  name text not null check (char_length(trim(name)) between 2 and 80),
  email text not null check (char_length(trim(email)) between 5 and 320),
  message text not null check (char_length(trim(message)) between 10 and 4000),
  platform text not null default '',
  app_version text not null default '',
  steps_to_reproduce text not null default '',
  expected_behavior text not null default '',
  actual_behavior text not null default '',
  page text not null default '',
  user_agent text not null default '',
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists feedback_submissions_created_at_idx
  on public.feedback_submissions (created_at desc);

create index if not exists feedback_submissions_type_created_at_idx
  on public.feedback_submissions (type, created_at desc);

create index if not exists feedback_submissions_email_created_at_idx
  on public.feedback_submissions (lower(email), created_at desc);

alter table public.feedback_submissions enable row level security;

revoke all on public.feedback_submissions from anon;
revoke all on public.feedback_submissions from authenticated;