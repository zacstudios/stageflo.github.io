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

## Download Lead Capture (GitHub Pages)

This site is static on GitHub Pages, so downloads can only be gated with a client-side form that posts to an external endpoint.

### Recommended Setup With Supabase

The preferred setup is a Supabase Edge Function that receives the lead form payload and writes to a `download_leads` table.

Setup steps:

1. Create a Supabase project.
2. Apply [supabase/migrations/20260502193000_create_download_leads.sql](supabase/migrations/20260502193000_create_download_leads.sql).
3. Deploy [supabase/functions/capture-download-lead/index.ts](supabase/functions/capture-download-lead/index.ts).
4. Add GitHub repository secret `NEXT_PUBLIC_SUPABASE_FUNCTION_URL` with your deployed function URL.
5. Push to `main` to trigger deploy.

Expected function URL format:

```text
https://<project-ref>.functions.supabase.co/capture-download-lead
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
3. Deploy `capture-download-lead` with `--no-verify-jwt` so the public website can call it.
4. Set function secrets and update the GitHub repo secret `NEXT_PUBLIC_SUPABASE_FUNCTION_URL`.

### Legacy Generic Endpoint Override

If needed, the site still supports `NEXT_PUBLIC_DOWNLOAD_LEAD_ENDPOINT` as a generic fallback for non-Supabase providers.

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
