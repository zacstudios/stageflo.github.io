alter table public.download_leads
  add column if not exists onboarding_step_2_sent_at timestamptz,
  add column if not exists onboarding_step_3_sent_at timestamptz,
  add column if not exists onboarding_step_4_sent_at timestamptz,
  add column if not exists onboarding_sequence_completed_at timestamptz,
  add column if not exists onboarding_last_attempt_at timestamptz,
  add column if not exists onboarding_last_error text not null default '',
  add column if not exists onboarding_attempt_count integer not null default 0
    check (onboarding_attempt_count >= 0);

create index if not exists download_leads_onboarding_progress_idx
  on public.download_leads (
    created_at asc,
    onboarding_step_2_sent_at,
    onboarding_step_3_sent_at,
    onboarding_step_4_sent_at
  );
