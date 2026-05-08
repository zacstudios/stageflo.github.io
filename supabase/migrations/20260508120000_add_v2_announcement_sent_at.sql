-- Track whether a lead has been sent the v2.0 feature announcement.
-- Null = not yet sent. Timestamptz = when it was sent.
-- This makes the broadcast function idempotent (safe to re-run).
alter table public.download_leads
  add column if not exists v2_announcement_sent_at timestamptz;

create index if not exists download_leads_v2_announcement_sent_at_idx
  on public.download_leads (v2_announcement_sent_at)
  where v2_announcement_sent_at is null;
