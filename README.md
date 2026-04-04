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

## Notes

- No custom domain configured.
- Download links point to StageFlo releases:
	- https://github.com/zacstudios/stageflo/releases/latest
# Restored working homepage
