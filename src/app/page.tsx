import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";
import GatedDownloadLink from "./components/gatedDownloadLink";

const CURRENT_VERSION = "1.65.0";
const MAC_DOWNLOAD_URL = `https://github.com/zacstudios/Stageflo.app/releases/download/v${CURRENT_VERSION}/stageflo-${CURRENT_VERSION}.dmg`;
const WINDOWS_DOWNLOAD_URL = `https://github.com/zacstudios/Stageflo.app/releases/download/v${CURRENT_VERSION}/stageflo-${CURRENT_VERSION}-setup.exe`;

const testimonials = [
  {
    text: "StageFlo transformed our worship tech workflow. It's free, powerful, and just works.",
    author: "Marcus W.",
    role: "Worship Director",
  },
  {
    text: "The remote singer view is a game-changer. Our team feels more connected during every service.",
    author: "Sarah K.",
    role: "Tech Lead",
  },
  {
    text: "No subscriptions, no lock-in, pure functionality. This is worship software the right way.",
    author: "David L.",
    role: "Church Tech Lead",
  },
];

const featureGroups = [
  {
    title: "Content Creation",
    features: [
      { name: "Song Library Management", desc: "Search songs by title, artist, or lyrics instantly." },
      { name: "Bible Integration", desc: "Look up passages and convert them to slides in one click." },
      { name: "Multi-Lingual Support", desc: "Prepare and present content for multilingual churches in one service flow." },
      { name: "XML Bible Format Support", desc: "Import XML Bible datasets used by church workflows and compatible libraries." },
      { name: "Custom Slides", desc: "Build announcements, prayers, and worship direction slides." },
      { name: "Media Integration", desc: "Embed videos, images, and audio directly into presentations." },
    ],
  },
  {
    title: "Live Control",
    features: [
      { name: "Hotkeys & Shortcuts", desc: "Control playback with keyboard shortcuts for your workflow." },
      { name: "Remote Controller", desc: "Manage presentations from wireless devices during service." },
      { name: "Multi-Output Sync", desc: "Control projector, stage display, and overlays simultaneously." },
      { name: "Remote Singer View", desc: "Mobile-friendly stage view for singers with current and next lyrics on phones or tablets." },
    ],
  },
  {
    title: "Output and Design",
    features: [
      { name: "Advanced Text Styling", desc: "Rich formatting with fonts, colors, shadows, and outlines." },
      { name: "OBS Lower Third Overlays", desc: "Send song titles and speaker names as lower thirds into OBS for streaming." },
      { name: "Stage Display", desc: "Confidence monitor with notes and timing for speakers." },
      { name: "Template System", desc: "Design once, reuse across services with visual overrides." },
    ],
  },
];

const installSteps = {
  macOS: [
    "Open the StageFlo mac downloads page.",
    "Open the DMG and drag StageFlo to Applications.",
    "Launch StageFlo and configure outputs.",
  ],
  Windows: [
    "Open the StageFlo Windows downloads page.",
    "Run the installer and follow prompts.",
    "Launch StageFlo from Start Menu.",
  ],
};

const screenshotCards = [
  {
    title: "Operator Workspace",
    body: "Playlist planning, preview panel, and live controls.",
    src: "/screenshots/operator-workspace.png",
    alt: "StageFlo operator workspace with library, playlist, and preview panels.",
  },
  {
    title: "Slide Editor",
    body: "Layer styling, typography tuning, and visual overrides.",
    src: "/screenshots/slide-editor.png",
    alt: "StageFlo slide editor showing text and layout styling controls.",
  },
  {
    title: "Projector and Stage Output",
    body: "Readable congregation output with confidence monitor support.",
    src: "/screenshots/projector-stage.png",
    alt: "StageFlo projector and stage output displays during a live presentation.",
  },
  {
    title: "Stage Display Focus",
    body: "Live current and next-slide confidence view for speakers and musicians.",
    src: "/screenshots/stage-display.png",
    alt: "StageFlo stage display view showing current and next slide panels.",
  },
];

const compareColumns = [
  { name: "StageFlo", tone: "stageflo" },
  { name: "ProPresenter", tone: "dark" },
  { name: "EasyWorship", tone: "pink" },
  { name: "VideoPsalm", tone: "dark" },
  { name: "OpenLP", tone: "pink" },
  { name: "ProClaim", tone: "dark" },
] as const;

const compareRows = [
  { label: "Platforms", values: ["mac win linux", "mac win", "win", "win", "mac win linux", "mac win"] },
  { label: "Price", values: ["Free", "$289/yr", "$180/yr", "Free", "Free", "$250/yr"] },
  { label: "Multiple languages", values: ["Yes", "Yes", "No", "Yes", "Yes", "Yes"] },
  { label: "XML Bible format", values: ["Yes", "Import tool", "Limited", "Yes", "Yes", "Limited"] },
  { label: "Cloud sync", values: ["Yes", "Yes", "No", "Yes", "No", "Yes"] },
  { label: "Customer support", values: ["Yes", "Yes", "Yes", "Yes", "Yes", "Yes"] },
  { label: "Projects", values: ["Yes", "Yes", "Yes", "Yes", "Yes", "Yes"] },
  { label: "Slides", values: ["Yes", "Yes", "Yes", "Yes", "Yes", "Yes"] },
  { label: "Groups", values: ["Yes", "Yes", "No", "No", "Yes", "Yes"] },
  { label: "Preview", values: ["Yes", "Yes", "Yes", "Yes", "Yes", "Yes"] },
  { label: "Rich text editor", values: ["Yes", "Yes", "Yes", "Yes", "No", "Yes"] },
  { label: "Live text edit", values: ["Yes", "Yes", "Yes", "Yes", "Yes", "Yes"] },
  { label: "Auto labels", values: ["Yes", "Yes", "Yes", "Yes", "No", "No"] },
  { label: "Chords", values: ["Yes", "Yes", "No", "Yes", "Yes", "No"] },
  { label: "Themes", values: ["Yes", "No", "No", "Yes", "No", "No"] },
  { label: "OBS lower-thirds", values: ["Yes", "Plugin/manual", "Manual", "Manual", "Manual", "Manual"] },
];

const getCompareTone = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (normalized === "yes" || normalized === "free") return "yes";
  if (normalized === "no") return "no";
  if (normalized === "plugin/manual" || normalized === "manual" || normalized === "partial") return "partial";
  return "text";
};

const trustItems = [
  {
    title: "Open-source Project",
    body: "Built in public with issues, roadmap, and release notes visible to everyone.",
    href: "https://github.com/zacstudios/Stageflo.app",
    label: "View Source",
  },
  {
    title: "Community Driven",
    body: "Requests and bugs are prioritized from real church and worship-team feedback.",
    href: "/feedback/",
    label: "Share Feedback",
  },
  {
    title: "Production Ready",
    body: "Desktop builds are published with update feeds for predictable deployment.",
    href: "/updates/",
    label: "Update Channel",
  },
];

const languageBadges = [
  "English",
  "Spanish",
  "French",
  "Hindi",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Kannada",
  "Bengali",
  "Marathi",
  "Punjabi",
  "Gujarati",
  "Arabic",
  "Portuguese",
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
          <Link href="/docs/introduction/">Docs</Link>
          <a href="#screenshots">Screenshots</a>
          <a href="#install">Install</a>
          <a href="#community">Community</a>
        </nav>
      </header>

      <main className="page-main">
        <section className="hero" id="home">
          <p className="eyebrow">Worship Presentation Software for Multilingual Churches</p>
          <h1>Run Songs, Scripture, Media, and Multi-Screen Output from One Flow</h1>
          <p className="lead">
            StageFlo helps worship teams prepare and present with confidence across operator,
            projector, stage, and lower-third displays, including a mobile remote singer view for on-stage teams.
          </p>
          <p className="lead">
            Latest builds: macOS v{latestMac.version} and Windows v{latestWindows.version}.
          </p>
          <div className="cta-row">
            <GatedDownloadLink
              className="button button-primary"
              href={latestMacDownloadUrl}
              source="desktop"
              formTitle="Download StageFlo for macOS"
            >
              Download macOS v{latestMac.version}
            </GatedDownloadLink>
            <GatedDownloadLink
              className="button button-secondary"
              href={latestWindowsDownloadUrl}
              source="desktop"
              formTitle="Download StageFlo for Windows"
            >
              Download Windows v{latestWindows.version}
            </GatedDownloadLink>
          </div>
        </section>

        <section className="mission section-block" id="features">
          <div className="section-head">
            <h2>Our Mission</h2>
            <p>
              Worship teams spend too much on presentation software. We built StageFlo to be free, open-source, and powerful.
              No subscriptions, no lock-in, no limitations. Just worship tech that works for your team.
            </p>
          </div>
        </section>

        <section className="language-highlight section-block" id="multilingual">
          <div className="section-head">
            <h2>Built for Multi-Lingual Churches</h2>
            <p>
              StageFlo helps teams run services in multiple languages and supports XML Bible formats used by many church workflows.
            </p>
          </div>
          <div className="language-badges" aria-label="Common language support examples">
            {languageBadges.map((language) => (
              <span key={language} className="language-badge">{language}</span>
            ))}
          </div>
          <p className="language-usecase">
            Example: show English on projector, Hindi or Tamil for livestream captions, and native-language notes on stage display in the same service.
          </p>
          <div className="language-grid">
            <article className="language-card reveal">
              <h3>Multi-Language Service Flow</h3>
              <p>
                Prepare songs and scriptures for bilingual and multilingual congregations while keeping one clear live flow for operators.
              </p>
            </article>
            <article className="language-card reveal">
              <h3>XML Bible Format Compatibility</h3>
              <p>
                StageFlo supports XML Bible import paths used by church media teams and resources cataloged at Bible List.
              </p>
              <a href="https://biblelist.netlify.app" target="_blank" rel="noopener noreferrer">
                Browse Bible XML Resources
              </a>
            </article>
          </div>
        </section>

        <section className="overview section-block" id="overview">
          <div className="section-head">
            <h2>What is StageFlo</h2>
            <p>
              StageFlo is an all-in-one presenter for songs, scripture, media, and synchronized outputs.
              Start with the product walkthrough, then dive into docs for setup details.
            </p>
          </div>
          <div className="overview-grid">
            <a
              className="video-card reveal"
              href="https://github.com/zacstudios/Stageflo.app#readme"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/screenshots/operator-workspace.png"
                alt="StageFlo overview thumbnail"
                width={1280}
                height={720}
              />
              <span>Open Product Walkthrough</span>
            </a>
            <article className="card reveal">
              <h3 className="resource-title">Quick Start Resources</h3>
              <p>
                Use docs, sample workflows, and support links to get your first service running fast.
              </p>
              <div className="cta-row resource-links">
                <a className="button button-secondary" href="https://github.com/zacstudios/Stageflo.app#readme" target="_blank" rel="noopener noreferrer">
                  Documentation
                </a>
                <a className="button button-secondary" href="/downloads/">
                  Downloads
                </a>
                <a className="button button-secondary" href="/feedback/">
                  Support
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="feature-showcase section-block">
          <div className="section-head">
            <h2>Powerful Features Organized for Worship</h2>
            <p>Everything you need to run a professional, multi-output worship service.</p>
          </div>

          {featureGroups.map((group) => (
            <div key={group.title} className="feature-group">
              <h3 className="feature-group-title">{group.title}</h3>
              <div className="feature-cards">
                {group.features.map((feature) => (
                  <article key={feature.name} className="card reveal">
                    <h4 className="feature-name">{feature.name}</h4>
                    <p>{feature.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="testimonials section-block">
          <div className="section-head">
            <h2>What Teams Are Saying</h2>
          </div>
          <div id="reviews" className="testimonial-grid">
            {testimonials.map((testimonial, index) => (
              <article
                key={`${testimonial.author}-${index}`}
                className="card reveal"
              >
                <p className="testimonial-quote">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <p className="testimonial-author">{testimonial.author}</p>
                <p className="testimonial-role">{testimonial.role}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="comparison" id="compare">
          <div className="section-head">
            <h2>How StageFlo Compares</h2>
            <p>
              StageFlo is built to keep advanced live-service workflows accessible without subscriptions.
            </p>
          </div>
          <div className="compare-wrap reveal" role="region" aria-label="StageFlo feature comparison">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Capability</th>
                  {compareColumns.map((column) => (
                    <th scope="col" key={column.name}>
                      <span className={`compare-vendor compare-vendor-${column.tone}`}>{column.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {row.values.map((value, index) => (
                      <td key={`${row.label}-${compareColumns[index].name}`}>
                        <span className={`compare-pill compare-pill-${getCompareTone(value)}`}>{value}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="compare-note">
            Values are practical workflow summaries for typical worship environments and are updated as feature parity changes.
          </p>
        </section>

        <section className="trust">
          <div className="section-head">
            <h2>What Others Look For Before Choosing</h2>
          </div>
          <div className="install-grid">
            {trustItems.map((item) => (
              <article key={item.title} className="install-card reveal">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <a href={item.href}>{item.label}</a>
              </article>
            ))}
          </div>
        </section>

        <section className="screenshots section-block" id="screenshots">
          <div className="section-head">
            <h2>Inside StageFlo</h2>
            <p>Real screenshots from StageFlo workflows used during live services.</p>
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

        <section className="install section-block" id="install">
          <div className="section-head">
            <h2>Install in Minutes</h2>
            <p>Use the latest downloads hosted directly on stageflo.app for your platform.</p>
          </div>
          <div className="install-grid">
            {Object.entries(installSteps).map(([platform, steps]) => (
              <article className="install-card reveal" key={platform}>
                <h3>{platform}</h3>
                <ol>
                  {steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <GatedDownloadLink
                  href={
                    platform === "macOS"
                      ? latestMacDownloadUrl
                      : latestWindowsDownloadUrl
                  }
                  source="desktop"
                  formTitle={`Download StageFlo for ${platform}`}
                >
                  {platform === "macOS"
                    ? `Open Downloads (v${latestMac.version})`
                    : `Open Downloads (v${latestWindows.version})`}
                </GatedDownloadLink>
              </article>
            ))}
          </div>
        </section>

        <section className="community section-block" id="community">
          <div className="section-head">
            <h2>Docs and Community</h2>
          </div>
          <div className="cta-row">
            <a
              className="button button-secondary"
              href="/downloads/"
            >
              Downloads Hub
            </a>
            <Link
              className="button button-secondary"
              href="/docs/introduction/"
            >
              Docs Introduction
            </Link>
            <a
              className="button button-secondary"
              href="/feedback/"
            >
              Feedback & Bugs
            </a>
            <a
              className="button button-secondary"
              href="https://github.com/zacstudios/Stageflo.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
            </a>
            <a
              className="button button-secondary"
              href="https://github.com/zacstudios/Stageflo.app/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Report an Issue
            </a>
          </div>
        </section>
      </main>

      <footer>
        <p>StageFlo</p>
        <small>Open-source worship presentation software for live services.</small>
        <small>
          <a href="/feedback/">Report Bug / Request Feature</a>
          {" • "}
          <a href="https://github.com/zacstudios/Stageflo.app" target="_blank" rel="noopener noreferrer">Source Code</a>
          {" • "}
          <a href="mailto:zac@stageflo.app">zac@stageflo.app</a>
        </small>
      </footer>
    </div>
  );
}
