alter table public.download_leads
  add column if not exists email_status text not null default 'pending'
    check (email_status in ('pending', 'sent', 'failed', 'skipped')),
  add column if not exists email_attempt_count integer not null default 0
    check (email_attempt_count >= 0),
  add column if not exists email_last_attempt_at timestamptz,
  add column if not exists email_sent_at timestamptz,
  add column if not exists email_error text not null default '',
  add column if not exists email_provider text not null default '',
  add column if not exists email_provider_message_id text not null default '';

create index if not exists download_leads_email_status_created_at_idx
  on public.download_leads (email_status, created_at desc);
