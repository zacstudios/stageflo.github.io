import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";
import GatedDownloadLink from "./components/gatedDownloadLink";

const CURRENT_VERSION = "1.65.0";
const MAC_DOWNLOAD_URL = `https://github.com/zacstudios/Stageflo.app/releases/download/v${CURRENT_VERSION}/stageflo-${CURRENT_VERSION}.dmg`;
const WINDOWS_DOWNLOAD_URL = `https://github.com/zacstudios/Stageflo.app/releases/download/v${CURRENT_VERSION}/stageflo-${CURRENT_VERSION}-setup.exe`;

const pillars = [
  {
    icon: "🎵",
    title: "Songs & Scripture",
    desc: "Instant search across your song library and Bible. Present lyrics and verses in seconds.",
  },
  {
    icon: "🖥️",
    title: "Multi-Screen Output",
    desc: "Projector, stage display, OBS lower-thirds, and a mobile singer view — all from one place.",
  },
  {
    icon: "🌐",
    title: "Multi-Language Ready",
    desc: "Run bilingual or multilingual services. English on screen, Tamil for captions, native on stage.",
  },
];

const newFeatures = [
  {
    label: "Public Link for Stage View & Remote",
    desc: "One click generates a live public URL (via Cloudflare) for your stage view and remote controller — shareable anywhere, no account needed. QR codes included.",
  },
  { label: "Remote Controller", desc: "Control slides from any phone or tablet on the same network — or from anywhere via the public link." },
  { label: "OBS Lower-Thirds", desc: "Push song titles and speaker names directly into your stream." },
  { label: "Zefania XML Bible Import", desc: "Import any Zefania-format Bible XML directly in the app — no external tools." },
  { label: "Live Text Edit", desc: "Fix a typo mid-service without leaving the live view." },
  { label: "Template System", desc: "Design once, apply across every slide and service." },
];

const screenshotCards = [
  {
    title: "Operator Workspace",
    body: "Playlist, preview, and live controls.",
    src: "/screenshots/operator-workspace.png",
    alt: "StageFlo operator workspace with library, playlist, and preview panels.",
  },
  {
    title: "Slide Editor",
    body: "Typography, layers, and visual overrides.",
    src: "/screenshots/slide-editor.png",
    alt: "StageFlo slide editor showing text and layout styling controls.",
  },
  {
    title: "Projector & Stage",
    body: "Congregation output and confidence monitor.",
    src: "/screenshots/projector-stage.png",
    alt: "StageFlo projector and stage output displays during a live presentation.",
  },
  {
    title: "Stage Display",
    body: "Current and next slide for speakers and musicians.",
    src: "/screenshots/stage-display.png",
    alt: "StageFlo stage display view showing current and next slide panels.",
  },
];

type LatestReleaseInfo = {
  version: string;
  url: string;
};

const parseManifest = (manifestText: string): LatestReleaseInfo | null => {
  const version = manifestText.match(/^version:\s*(.+)$/m)?.[1]?.trim();
  const url = manifestText.match(/^\s*- url:\s*(.+)$/m)?.[1]?.trim();

  if (!version || !url) return null;
  return { version, url };
};

const toMacDmgUrl = (url: string, version: string): string => {
  if (url.toLowerCase().endsWith('.dmg')) return url;
  return `https://github.com/zacstudios/Stageflo.app/releases/download/v${version}/stageflo-${version}.dmg`;
};

const toWindowsSetupUrl = (url: string, version: string): string => {
  if (/^https?:\/\//i.test(url)) return url;
  const normalized = url.replace(/^\/+/, '');
  return `https://github.com/zacstudios/stageflo.github.io/releases/download/v${version}/${normalized}`;
};

const readLatestReleaseManifest = async (fileName: string): Promise<LatestReleaseInfo | null> => {
  try {
    const manifestPath = path.join(process.cwd(), "public", "updates", fileName);
    const manifestText = await readFile(manifestPath, "utf8");
    return parseManifest(manifestText);
  } catch {
    return null;
  }
};

export const metadata: Metadata = {
  title: "StageFlo | Worship Presentation Software",
  description:
    "Run worship lyrics, Bible verses, media, overlays, and multi-screen outputs from one fast live-service workflow.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "StageFlo | Worship Presentation Software",
    description:
      "Single workflow for operator, projector, stage, and lower-third output.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StageFlo | Worship Presentation Software",
    description:
      "Single workflow for operator, projector, stage, and lower-third output.",
  },
};

export default async function Home() {
  const [macManifest, windowsManifest] = await Promise.all([
    readLatestReleaseManifest("latest-mac.yml"),
    readLatestReleaseManifest("latest.yml"),
  ]);

  const latestMac = macManifest ?? {
    version: CURRENT_VERSION,
    url: MAC_DOWNLOAD_URL,
  };
  const latestMacDownloadUrl = toMacDmgUrl(latestMac.url, latestMac.version);
  const latestWindows = windowsManifest ?? {
    version: CURRENT_VERSION,
    url: WINDOWS_DOWNLOAD_URL,
  };
  const latestWindowsDownloadUrl = toWindowsSetupUrl(latestWindows.url, latestWindows.version);

  const softwareAppStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "StageFlo",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "macOS, Windows, Linux",
    description:
      "Open-source worship presentation software for songs, scripture, media, overlays, and multi-screen outputs.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: "https://stageflo.app/",
    downloadUrl: [latestMacDownloadUrl, latestWindowsDownloadUrl],
  };

  return (
    <div className="site-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareAppStructuredData),
        }}
      />
      <header className="top-nav">
        <a className="brand" href="#home" aria-label="StageFlo home">
          <Image src="/stageflo-icon.png" alt="StageFlo" width={28} height={28} style={{ borderRadius: '0.55rem', background: 'rgba(124, 58, 237, 0.35)', boxShadow: '0 0 0 1.5px rgba(196, 181, 253, 0.5), 0 2px 10px rgba(124, 58, 237, 0.4)' }} />
          <span>StageFlo</span>
        </a>
        <nav>
          <a href="#features">Features</a>
          <a href="#screenshots">Screenshots</a>
          <Link href="/docs/introduction/">Docs</Link>
          <a href="/feedback/">Feedback</a>
        </nav>
      </header>

      <main className="page-main">

        {/* ── Hero ── */}
        <section className="hero" id="home">
          <p className="eyebrow">Free · Open-source · v{latestMac.version}</p>
          <h1>Worship software built for your whole team.</h1>
          <p className="lead">
            Songs, scripture, media, stage display, and OBS lower-thirds — all from one fast workflow. Free forever, for every church.
          </p>
          <div className="cta-row">
            <GatedDownloadLink
              className="button button-primary"
              href={latestMacDownloadUrl}
              source="desktop"
              formTitle="Download StageFlo for macOS"
            >
              Download for Mac
            </GatedDownloadLink>
            <GatedDownloadLink
              className="button button-secondary"
              href={latestWindowsDownloadUrl}
              source="desktop"
              formTitle="Download StageFlo for Windows"
            >
              Download for Windows
            </GatedDownloadLink>
          </div>
        </section>

        {/* ── 3 Pillars ── */}
        <section className="pillars section-block" id="features">
          <div className="pillar-grid">
            {pillars.map((p) => (
              <article key={p.title} className="pillar-card reveal">
                <span className="pillar-icon" aria-hidden="true">{p.icon}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Screenshots ── */}
        <section className="screenshots section-block" id="screenshots">
          <div className="section-head">
            <h2>Inside StageFlo</h2>
          </div>
          <div className="shot-grid">
            {screenshotCards.map((shot) => (
              <figure key={shot.src} className="shot reveal">
                <Image src={shot.src} alt={shot.alt} width={1600} height={900} />
                <figcaption>
                  <h3>{shot.title}</h3>
                  <p>{shot.body}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ── New in 2.0 ── */}
        <section className="new-features section-block" id="whats-new">
          <div className="section-head">
            <p className="eyebrow">What&rsquo;s new in 2.0</p>
            <h2>More power, less complexity.</h2>
          </div>
          <div className="new-features-grid">
            {newFeatures.map((f) => (
              <article key={f.label} className="new-feature-card reveal">
                <h4>{f.label}</h4>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="bottom-cta section-block">
          <h2>Ready to run a smoother service?</h2>
          <p className="lead">Download StageFlo free for Mac and Windows. No account needed.</p>
          <div className="cta-row">
            <GatedDownloadLink
              className="button button-primary"
              href={latestMacDownloadUrl}
              source="desktop"
              formTitle="Download StageFlo for macOS"
            >
              Download for Mac
            </GatedDownloadLink>
            <GatedDownloadLink
              className="button button-secondary"
              href={latestWindowsDownloadUrl}
              source="desktop"
              formTitle="Download StageFlo for Windows"
            >
              Download for Windows
            </GatedDownloadLink>
          </div>
        </section>

      </main>

      <footer>
        <p>StageFlo &mdash; Free worship presentation software.</p>
        <small>
          <a href="/feedback/">Feedback</a>
          {" · "}
          <Link href="/docs/introduction/">Docs</Link>
          {" · "}
          <a href="https://github.com/zacstudios/Stageflo.app" target="_blank" rel="noopener noreferrer">GitHub</a>
          {" · "}
          <a href="mailto:zac@stageflo.app">zac@stageflo.app</a>
        </small>
      </footer>
    </div>
  );
}
