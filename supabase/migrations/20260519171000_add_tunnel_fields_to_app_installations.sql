alter table public.app_installations
  add column if not exists tunnel_mode text,
  add column if not exists tunnel_active boolean not null default false,
  add column if not exists tunnel_hostname text;

create index if not exists app_installations_tunnel_mode_idx
  on public.app_installations (tunnel_mode);

create index if not exists app_installations_tunnel_active_idx
  on public.app_installations (tunnel_active);