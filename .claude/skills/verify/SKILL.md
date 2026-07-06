---
name: verify
description: Build, serve, and observe the stageflo.app static site (Next.js export) in a real browser.
---

# Verifying stageflo.github.io changes

Static-export Next.js site (`output: "export"`), deployed to GitHub Pages. No dev-server tricks needed — verify against the real `out/` build.

## Build

```bash
cd /Users/prince/stageflow/stageflo.github.io
NEXT_PUBLIC_SUPABASE_FUNCTION_URL="https://pddnsxdajqfhbrcrvjiz.functions.supabase.co/capture-download-lead" npm run build
```

The env var is baked into the client bundle at build time (prod injects it via repo secret in `.github/workflows/deploy.yml`). Note it is the **full capture-download-lead URL**, not a base URL — components derive other function endpoints from its origin.

## Serve + drive (no Playwright installed; use system Chrome headless)

```bash
cd out && python3 -m http.server 8931 &   # trailingSlash export serves fine

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
# Hydrated DOM (runs client JS incl. fetches):
"$CHROME" --headless=new --disable-gpu --virtual-time-budget=15000 --dump-dom http://localhost:8931/
# Screenshot:
"$CHROME" --headless=new --disable-gpu --virtual-time-budget=15000 --window-size=1280,900 --screenshot=/path/hero.png http://localhost:8931/
# Simulate backend outage (fallback-path probe):
"$CHROME" --headless=new ... --host-resolver-rules="MAP pddnsxdajqfhbrcrvjiz.functions.supabase.co 127.0.0.1" --dump-dom http://localhost:8931/
```

`--virtual-time-budget` is what lets async fetches settle before dump/screenshot.

## Edge functions

Deploy: `supabase functions deploy <name> --project-ref pddnsxdajqfhbrcrvjiz --no-verify-jwt --use-api` (ref also in `supabase/.temp/project-ref`).
Probe with plain `curl https://pddnsxdajqfhbrcrvjiz.functions.supabase.co/<name>` — public functions need no auth header.

## Gotchas

- Pre-release Next.js 16 — check `node_modules/next/dist/docs/` before assuming App Router APIs (see AGENTS.md).
- This is a nested git repo inside /Users/prince/stageflow — commit here, not the parent.
- Push to `main` auto-deploys Pages via `.github/workflows/deploy.yml`.
