-- Which leads have been sent which release announcement, so each broadcast is
-- sent at most once per lead and can be re-run safely after a partial run.
create table if not exists public.release_announcements (
  lead_id uuid not null references public.download_leads(id) on delete cascade,
  release text not null check (char_length(release) between 1 and 32),
  sent_at timestamptz not null default now(),
  provider_message_id text not null default '',
  primary key (lead_id, release)
);

alter table public.release_announcements enable row level security;

revoke all on public.release_announcements from anon;
revoke all on public.release_announcements from authenticated;
