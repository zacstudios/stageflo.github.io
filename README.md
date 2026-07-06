# StageFlo Website

Marketing site for StageFlo, published on GitHub Pages via static export.

## Stack

- Next.js (App Router)
- TypeScript
- Static export (`out/`)
- GitHub Actions Pages deployment

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Production Build

```bash
npm run build
```

This outputs static files to `out/`.

## Deployment

1. Push to `main`.
2. GitHub Actions runs `.github/workflows/deploy.yml`.
3. The generated `out/` artifact is deployed to GitHub Pages.

## Secret Scanning

This repo runs an automated secret scan on pushes and pull requests using gitleaks.

Workflow:

- `.github/workflows/secret-scan.yml`

If a secret-like value is committed, the workflow fails so it can be removed before merge.

Local pre-commit scan:

1. Run `npm run hooks:install` once per clone.
2. The hook scans staged additions and blocks commits that look like secrets.
3. Optional manual check: `npm run security:scan:staged`.

## Tunnel Offline Fallback

This repo now includes a static offline page at `/offline/` for StageFlo public links.

If you want `*.stageflo.app` tunnel URLs to redirect there when the desktop app or Cloudflare tunnel is down, use a Cloudflare Worker rather than a plain Redirect Rule. Redirect Rules run before the origin response is known, so they cannot reliably react to tunnel outage responses.

Included example worker:

- `scripts/cloudflare-tunnel-offline-worker.mjs`

Recommended Cloudflare setup:

1. Create a Worker using `scripts/cloudflare-tunnel-offline-worker.mjs`.
2. Set Worker env var `OFFLINE_PAGE_URL=https://stageflo.app/offline/`.
3. Attach a route such as `*.stageflo.app/*`.
4. Keep `stageflo.app/*` served normally so the offline page itself never loops.

The worker passes through healthy requests and issues a `302` redirect to `/offline/` when the tunnel returns a common origin-down status (`502`, `503`, `504`, `530`) or the fetch itself fails.

## Desktop Install Tracking

The StageFlo desktop app reports anonymous install and launch activity to Supabase so you can see how many unique installs are active and which app versions are currently in use.

Setup steps:

1. Apply [supabase/migrations/20260519143000_create_app_installations.sql](supabase/migrations/20260519143000_create_app_installations.sql).
2. Deploy [supabase/functions/capture-app-usage/index.ts](supabase/functions/capture-app-usage/index.ts).
3. Deploy [supabase/functions/usage-admin/index.ts](supabase/functions/usage-admin/index.ts) for usage dashboard queries.
4. Rebuild or release the desktop app so it points at the new usage endpoint.

The desktop app stores a persistent anonymous install ID in user data and reports the current version on every packaged launch. The latest active version for each install is written to `app_installations.last_version`.
Telemetry also includes tunnel metadata (`tunnel_mode`, `tunnel_active`, `tunnel_hostname`) so you can analyze named/quick tunnel adoption.

## Download Lead Capture (GitHub Pages)

This site is static on GitHub Pages, so downloads can only be gated with a client-side form that posts to an external endpoint.

### Recommended Setup With Supabase

The preferred setup is a Supabase Edge Function that receives the lead form payload and writes to a `download_leads` table.

Setup steps:

1. Create a Supabase project.
2. Apply [supabase/migrations/20260502193000_create_download_leads.sql](supabase/migrations/20260502193000_create_download_leads.sql).
3. Apply [supabase/migrations/20260526120000_add_onboarding_sequence_tracking.sql](supabase/migrations/20260526120000_add_onboarding_sequence_tracking.sql) to track onboarding email progress.
4. Apply [supabase/migrations/20260526153000_create_feedback_submissions.sql](supabase/migrations/20260526153000_create_feedback_submissions.sql) to store website feedback submissions.
5. Deploy [supabase/functions/capture-download-lead/index.ts](supabase/functions/capture-download-lead/index.ts).
6. Deploy [supabase/functions/capture-feedback/index.ts](supabase/functions/capture-feedback/index.ts).
7. Deploy [supabase/functions/send-onboarding-sequence/index.ts](supabase/functions/send-onboarding-sequence/index.ts).
8. Add GitHub repository secret `NEXT_PUBLIC_SUPABASE_FUNCTION_URL` with your deployed function URL.
9. Push to `main` to trigger deploy.

Expected function URL format:

```text
https://<project-ref>.functions.supabase.co/capture-download-lead
```

Feedback endpoint format:

```text
https://<project-ref>.functions.supabase.co/capture-feedback
```

The GitHub Pages deploy workflow already injects `NEXT_PUBLIC_SUPABASE_FUNCTION_URL` into the site build via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

CLI shortcut from this repo:

```bash
SUPABASE_ACCESS_TOKEN=... \
SUPABASE_PROJECT_REF=... \
SUPABASE_DB_PASSWORD=... \
npm run setup:supabase
```

For a brand new project, provide `SUPABASE_ORG_ID` and optionally `SUPABASE_REGION` / `SUPABASE_PROJECT_NAME` instead of `SUPABASE_PROJECT_REF`.

The helper script will:

1. Create or link the Supabase project.
2. Push the SQL migration.
3. Deploy `capture-download-lead`, `capture-feedback`, `send-onboarding-sequence`, `capture-app-usage`, `usage-admin`, and `free-spots-count` with `--no-verify-jwt` so the public website and desktop app can call them.
4. Set function secrets and update the GitHub repo secret `NEXT_PUBLIC_SUPABASE_FUNCTION_URL`.

Optional hardening for `tunnel-register`:

- Set `TUNNEL_REGISTER_TOKEN` as a Supabase function secret.
- When set, callers must send `x-tunnel-token: <TUNNEL_REGISTER_TOKEN>`.
- If unset, existing behavior remains unchanged for backward compatibility.

### Onboarding Email Automation (Resend)

`capture-download-lead` sends the first welcome email immediately. The remaining onboarding emails (day 2, day 4, day 7) are sent by `send-onboarding-sequence`.

Run it manually (dry run):

```bash
curl "https://<project-ref>.functions.supabase.co/send-onboarding-sequence?dry_run=true&batch=100" \
	-H "x-admin-key: <ADMIN_API_KEY>"
```

Run it live:

```bash
curl -X POST "https://<project-ref>.functions.supabase.co/send-onboarding-sequence?batch=100" \
	-H "x-admin-key: <ADMIN_API_KEY>"
```

Recommended automation: schedule this endpoint hourly using Supabase Scheduled Functions, GitHub Actions cron, or your preferred scheduler.

GitHub Actions cron is included in [.github/workflows/run-onboarding-sequence.yml](.github/workflows/run-onboarding-sequence.yml).

Required repository secrets for the workflow:

- `NEXT_PUBLIC_SUPABASE_FUNCTION_URL` (already used by site build; ends with `/capture-download-lead`)
- `ADMIN_API_KEY` (used by the onboarding function auth)

The workflow runs hourly and can also be triggered manually with:

- `dry_run=true` to preview eligible leads without sending
- `batch=<number>` to control max sends per run

### Legacy Generic Endpoint Override

If needed, the site still supports `NEXT_PUBLIC_DOWNLOAD_LEAD_ENDPOINT` as a generic fallback for non-Supabase providers.

For feedback intake, you can optionally set `NEXT_PUBLIC_FEEDBACK_ENDPOINT` to a custom endpoint. If unset, the site derives `/capture-feedback` from `NEXT_PUBLIC_SUPABASE_FUNCTION_URL`.

### Other Endpoint Options

You can also use Basin, Google Apps Script, or your own API.

Expected request payload:

```json
{
	"name": "Jane Doe",
	"email": "jane@example.com",
	"marketingOptIn": true,
	"consent": true,
	"source": "desktop",
	"downloadUrl": "https://...",
	"page": "https://stageflo.app/",
	"submittedAt": "2026-04-11T00:00:00.000Z"
}
```

If neither `NEXT_PUBLIC_SUPABASE_FUNCTION_URL` nor `NEXT_PUBLIC_DOWNLOAD_LEAD_ENDPOINT` is set, the gate appears but downloads are blocked until the endpoint is configured.

## Notes

- No custom domain configured.
- Download links point to StageFlo releases:
	- https://github.com/zacstudios/stageflo/releases/latest
# Restored working homepage
