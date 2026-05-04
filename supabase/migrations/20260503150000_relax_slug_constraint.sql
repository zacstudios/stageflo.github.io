-- Relax the slug check constraint to allow 3-30 char slugs
-- (previously required min 5 chars: [a-z0-9][a-z0-9-]{3,28}[a-z0-9])
-- The new pattern allows pure alphanumeric slugs of 3-30 chars in addition
-- to hyphenated slugs of 5-30 chars.

alter table public.tunnel_registrations
  drop constraint tunnel_registrations_slug_check;

alter table public.tunnel_registrations
  add constraint tunnel_registrations_slug_check
  check (
    slug ~ '^[a-z0-9][a-z0-9-]{3,28}[a-z0-9]$'
    or slug ~ '^[a-z0-9]{3,30}$'
  );
