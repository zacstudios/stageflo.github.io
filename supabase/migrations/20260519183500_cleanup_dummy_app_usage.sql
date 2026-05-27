delete from public.app_installations
where install_id in (
  'live-smoke-test-install',
  'live-smoke-test-install-2'
)
or install_id like 'live-smoke-test-%';