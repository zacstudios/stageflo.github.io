/**
 * Generates /public/og-image.png (1200×630) for social previews.
 * Run: node scripts/generate-og-image.mjs
 */
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public/og-image.png");

// ── Icon: we embed the stageflo-icon as base64 ────────────────────────────
const iconPath = path.join(__dirname, "../public/stageflo-icon.png");
const iconB64 = Buffer.from(await fs.readFile(iconPath)).toString("base64");
const iconDataUri = `data:image/png;base64,${iconB64}`;

// ── SVG card ───────────────────────────────────────────────────────────────
// 1200×630, brand dark-purple bg, purple glow, white text
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0c101e"/>
      <stop offset="100%" stop-color="#0f0f1a"/>
    </linearGradient>
    <radialGradient id="glow1" cx="12%" cy="0%" r="45%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="88%" cy="10%" r="40%">
      <stop offset="0%" stop-color="#6d28d9" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#6d28d9" stop-opacity="0"/>
    </radialGradient>
    <filter id="iconShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="18" flood-color="#7c3aed" flood-opacity="0.55"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- Subtle grid lines -->
  <line x1="0" y1="315" x2="1200" y2="315" stroke="rgba(124,58,237,0.08)" stroke-width="1"/>
  <line x1="600" y1="0" x2="600" y2="630" stroke="rgba(124,58,237,0.08)" stroke-width="1"/>

  <!-- Border -->
  <rect x="1" y="1" width="1198" height="628" rx="0" fill="none"
    stroke="rgba(196,181,253,0.12)" stroke-width="2"/>

  <!-- Left accent bar -->
  <rect x="0" y="0" width="6" height="630" fill="#7c3aed" opacity="0.85"/>

  <!-- App icon (80×80, rounded) -->
  <image href="${iconDataUri}" x="72" y="72" width="84" height="84"
    clip-path="inset(0 round 18px)" filter="url(#iconShadow)"/>

  <!-- Brand name next to icon -->
  <text x="178" y="124" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
    font-size="38" font-weight="700" fill="#f1f5f9" letter-spacing="-0.5">StageFlo</text>

  <!-- By Zac Studios -->
  <text x="178" y="148" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
    font-size="15" fill="rgba(196,181,253,0.55)" letter-spacing="0">by Zac Studios Ltd</text>

  <!-- Main headline -->
  <text x="72" y="270" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
    font-size="58" font-weight="700" fill="#f1f5f9" letter-spacing="-1.5">Free Worship</text>
  <text x="72" y="340" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
    font-size="58" font-weight="700" fill="#f1f5f9" letter-spacing="-1.5">Presentation Software</text>

  <!-- Sub-headline -->
  <text x="72" y="394" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
    font-size="22" fill="rgba(241,245,249,0.62)" letter-spacing="-0.2">
    Songs · Bible · Stage Display · OBS Lower-Thirds · Remote Stage View
  </text>

  <!-- Feature pills row -->
  <!-- Pill 1: AI Search -->
  <rect x="72" y="462" width="185" height="38" rx="19" fill="rgba(124,58,237,0.28)"
    stroke="rgba(196,181,253,0.35)" stroke-width="1.5"/>
  <text x="164" y="486" font-family="system-ui, sans-serif" font-size="14" font-weight="600"
    fill="#c4b5fd" text-anchor="middle">✦ AI Semantic Search</text>

  <!-- Pill 2: Remote -->
  <rect x="270" y="462" width="185" height="38" rx="19" fill="rgba(20,184,166,0.15)"
    stroke="rgba(94,234,212,0.3)" stroke-width="1.5"/>
  <text x="362" y="486" font-family="system-ui, sans-serif" font-size="14" font-weight="600"
    fill="#5eead4" text-anchor="middle">📡 Remote Stage View</text>

  <!-- Pill 3: Free -->
  <rect x="468" y="462" width="120" height="38" rx="19" fill="rgba(34,197,94,0.12)"
    stroke="rgba(134,239,172,0.3)" stroke-width="1.5"/>
  <text x="528" y="486" font-family="system-ui, sans-serif" font-size="14" font-weight="600"
    fill="#86efac" text-anchor="middle">Free Forever</text>

  <!-- Pill 4: Offline -->
  <rect x="602" y="462" width="120" height="38" rx="19" fill="rgba(241,245,249,0.06)"
    stroke="rgba(241,245,249,0.15)" stroke-width="1.5"/>
  <text x="662" y="486" font-family="system-ui, sans-serif" font-size="14" font-weight="600"
    fill="rgba(241,245,249,0.7)" text-anchor="middle">Works Offline</text>

  <!-- URL bottom right -->
  <text x="1128" y="598" font-family="system-ui, sans-serif" font-size="18" font-weight="500"
    fill="rgba(196,181,253,0.5)" text-anchor="end">stageflo.app</text>
</svg>`;

// ── Convert SVG → PNG ──────────────────────────────────────────────────────
await sharp(Buffer.from(svg))
  .png()
  .toFile(OUT);

console.log(`✓ OG image written to ${OUT}`);
