-- Whether the install was live on its projector at its last heartbeat. With last_seen_at, the
-- usage report shows which installs are presenting right now. Versions before 2.1.71 never send
-- it, so it stays false for them.
alter table public.app_installations
  add column if not exists is_presenting boolean not null default false;
