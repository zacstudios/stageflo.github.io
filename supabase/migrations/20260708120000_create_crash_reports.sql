create extension if not exists pgcrypto;

create table if not exists public.crash_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  install_id text not null,
  session_id text not null default '',
  app_version text not null default '',
  platform text not null default '',
  arch text not null default '',
  electron_version text not null default '',
  is_packaged boolean not null default true,
  -- Crash class: main-uncaught-exception, main-unhandled-rejection,
  -- render-process-gone, child-process-gone, renderer-uncaught,
  -- renderer-unhandled-rejection, renderer-error-boundary
  kind text not null,
  -- Emitting process: main | renderer | output
  source text not null default '',
  message text not null default '',
  stack text not null default '',
  occurred_at timestamptz not null default now()
);

create index if not exists crash_reports_created_at_idx
  on public.crash_reports (created_at desc);

create index if not exists crash_reports_install_id_idx
  on public.crash_reports (install_id);

create index if not exists crash_reports_kind_idx
  on public.crash_reports (kind);

alter table public.crash_reports enable row level security;

revoke all on public.crash_reports from anon;
revoke all on public.crash_reports from authenticated;
