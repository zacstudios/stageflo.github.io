alter table public.download_leads
  add column if not exists redownload_count integer not null default 0,
  add column if not exists last_redownload_at timestamptz,
  add column if not exists last_redownload_email_status text not null default '',
  add column if not exists last_redownload_error text not null default '';
