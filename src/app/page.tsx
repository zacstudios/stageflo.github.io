import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";
import FreeSpotsCounter from "./components/freeSpotsCounter";
import GatedDownloadLink from "./components/gatedDownloadLink";
import TopNav from "./components/topNav";

const CURRENT_VERSION = "2.0.1";
const MAC_DOWNLOAD_URL = `https://github.com/zacstudios/Stageflo.app/releases/download/v${CURRENT_VERSION}/stageflo-${CURRENT_VERSION}.dmg`;
const WINDOWS_DOWNLOAD_URL = `https://github.com/zacstudios/Stageflo.app/releases/download/v${CURRENT_VERSION}/stageflo-${CURRENT_VERSION}-setup.exe`;

const pillars = [
  {
    icon: "✦",
    accent: true,
    title: "AI Semantic Search",
    desc: "Search your Bible and song library by meaning, not just exact words. Works offline across English, Malayalam, Hindi, Tamil, Telugu and more.",
    badge: "New in 2.0",
  },
  {
    icon: "📡",
    accentTeal: true,
    title: "Remote Stage View",
    desc: "One click generates a public internet link for your stage display and remote controller — share it with musicians anywhere, no account needed.",
    badge: "New in 2.0",
  },
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
    desc: "Run multilingual worship services with native-language, translated, and bilingual slide layouts for global congregations.",
  },
  {
    icon: "✨",
    title: "Live Visuals",
    desc: "Audio-reactive animated backgrounds that move with your music. Customise colours, speed, and intensity — or layer a photo or video underneath for unique effects.",
    badge: "New in 2.1",
  },
];

const aiFeatures = [
  { icon: "🔍", text: "Search by meaning — \"women at the well\" finds John 4 without exact words" },
  { icon: "🌏", text: "Multilingual support — English, Malayalam, Hindi, Tamil, Telugu, and more" },
  { icon: "📴", text: "Fully offline — 117 MB model runs in-process, no Ollama or internet needed" },
  { icon: "⚡", text: "~20 ms per query after warm-up, results cached locally for instant re-searches" },
  { icon: "📖", text: "Bible and song library both indexed automatically in the background" },
  { icon: "🤖", text: "AI tab auto-activates in Song Library when keyword search returns nothing" },
];

const remoteFeatures = [
  { icon: "🔗", text: "One click — StageFlo generates a public URL via Cloudflare Tunnel instantly" },
  { icon: "🌍", text: "Works over the internet — send the link to musicians or speakers anywhere" },
  { icon: "📱", text: "Stage display shows current slide, next slide, and notes on any phone or tablet" },
  { icon: "🎛️", text: "Remote controller lets anyone advance slides or mute output from their device" },
  { icon: "🔒", text: "No account, no port-forwarding, no static IP — tunnel is created on demand" },
  { icon: "⚡", text: "Low-latency sync — stage view updates within milliseconds of each slide change" },
];

const visualizerFeatures = [
  { icon: "🎵", text: "10 presets — Aurora, Nebula, Bloom, Heaven, Liquid, and more — all reacting to live audio" },
  { icon: "🎨", text: "4-colour customisation with speed, brightness, glow, saturation, and hue controls" },
  { icon: "🖼️", text: "Background Mix — layer any photo or video under the visualizer and blend them together" },
  { icon: "🎤", text: "Selectable audio input — works with any microphone or audio interface" },
  { icon: "💾", text: "Settings saved automatically per service item — ready every week without re-configuring" },
  { icon: "🖥️", text: "Full resolution output to projector and stage display" },
];

const newFeatures = [
  {
    label: "Live Visuals",
    badge: "New",
    desc: "10 audio-reactive visualizer presets with customisable colours, speed, glow, and intensity. Layer any background image or video underneath for unique mixed effects.",
  },
  {
    label: "Offline AI Search",
    badge: "New",
    desc: "Semantic search powered by multilingual-e5-small via ONNX — no cloud, no Ollama. Just type what you're looking for.",
  },
  {
    label: "Remote Stage View over Internet",
    badge: "New",
    desc: "One click generates a live public URL (via Cloudflare) for your stage view and remote controller — shareable anywhere, no account needed.",
  },
  {
    label: "Remote Controller",
    desc: "Control slides from any phone or tablet on the same network — or from anywhere via the public link.",
  },
  { label: "OBS Lower-Thirds", desc: "Push song titles and speaker names directly into your stream." },
  { label: "Zefania XML Bible Import", desc: "Import any Zefania-format Bible XML directly in the app — no external tools." },
  { label: "Live Text Edit", desc: "Fix a typo mid-service without leaving the live view." },
  { label: "Template System", desc: "Design once, apply across every slide and service." },
  { label: "Output Lock", desc: "Lock output windows to prevent accidental exposure. Press Cmd+L to lock, Cmd+R to restore." },
];

const churchUseCases = [
  {
    title: "Multilingual church worship slides",
    body: "Prepare worship lyrics, Bible readings, notices, sermon media, and custom slides for congregations using more than one language.",
  },
  {
    title: "Multilingual Bible verse projection",
    body: "Present scripture in English, Malayalam, Hindi, Tamil, Telugu, and other languages while keeping text readable on projector and stage displays.",
  },
  {
    title: "Bilingual lyrics for mixed congregations",
    body: "Show native-language lyrics, transliteration, translations, and English support for second-generation, diaspora, and multicultural worship teams.",
  },
  {
    title: "Livestream lower thirds",
    body: "Send song titles, speaker names, and lower-third overlays into OBS for multilingual livestreams without building a separate graphics workflow.",
  },
];

const comparisonPoints = [
  {
    title: "A free ProPresenter alternative for smaller teams",
    body: "StageFlo focuses on the worship workflows churches use every week: songs, scripture, media, stage display, and fast live control, without a subscription barrier.",
  },
  {
    title: "An OpenLP alternative with modern live controls",
    body: "Teams that want a simpler desktop app can use StageFlo for drag-and-drop planning, visual slide editing, remote control, and multi-screen output.",
  },
  {
    title: "An EasyWorship alternative for Mac and Windows",
    body: "StageFlo runs on macOS and Windows, supports offline service operation, and is free forever for the first 100 churches.",
  },
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
  title: "StageFlo | Multilingual Worship Presentation Software",
  description:
    "Free multilingual worship presentation software for churches. Run songs, Bible verses, media, and bilingual slides in English, Malayalam, Hindi, Tamil, Telugu, and more.",
  keywords: [
    "multilingual worship presentation software",
    "multilingual church presentation software",
    "bilingual worship slides",
    "multi language worship software",
    "international church presentation software",
    "diaspora church worship software",
    "Indian church presentation software",
    "Indian worship presentation software",
    "Malayalam worship software",
    "Hindi worship software",
    "Tamil worship software",
    "Telugu worship software",
    "worship presentation software",
    "church presentation software",
    "free worship software",
    "lyric projection software",
    "ProPresenter alternative",
    "EasyWorship alternative",
    "OpenLP alternative",
    "Bible presentation software",
    "stage display software",
    "OBS lower thirds worship",
    "multilingual worship software",
    "offline worship software",
    "church software Mac",
    "church software Windows",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "StageFlo | Multilingual Worship Presentation Software",
    description:
      "Run worship slides in English, Malayalam, Hindi, Tamil, Telugu, and more — one free app for songs, scripture, media, stage display, and livestreams.",
    url: "/",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StageFlo | Free Worship Presentation Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StageFlo | Multilingual Worship Presentation Software",
    description:
      "Run worship slides in English, Malayalam, Hindi, Tamil, Telugu, and more — one free app for songs, scripture, media, stage display, and livestreams.",
    images: ["/og-image.png"],
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
    operatingSystem: "macOS, Windows",
    description:
      "Free for the first 100 churches — multilingual worship presentation software. Run worship lyrics, Bible verses, media, stage display, and bilingual slides from one fast workflow.",
    featureList: [
      "Worship lyrics presentation",
      "Bible verse projection",
      "Multilingual church worship slides",
      "Malayalam, Hindi, Tamil, Telugu, and global language support",
      "Bilingual lyrics and scripture",
      "Multi-screen projector and stage display",
      "OBS lower-thirds output",
      "Offline AI semantic search",
      "Remote stage view",
      "Multilingual worship slides",
      "Audio-reactive live visuals",
      "Visualizer background mixing",
    ],
    screenshot: screenshotCards.map((shot) => `https://stageflo.app${shot.src}`),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/LimitedAvailability",
      description: "Free forever for the first 100 churches (early-adopter offer). Paid plans will follow.",
    },
    url: "https://stageflo.app/",
    downloadUrl: [latestMacDownloadUrl, latestWindowsDownloadUrl],
    softwareVersion: CURRENT_VERSION,
    author: {
      "@type": "Organization",
      name: "Zac Studios",
      url: "https://stageflo.app/",
    },
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is StageFlo free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — for the first 100 churches. StageFlo is in its early-adopter phase: the first 100 churches to join get StageFlo free forever, with no subscription, no feature gating, and no account required for core use. After that, paid plans for churches will be introduced, but early adopters keep free access for life.",
        },
      },
      {
        "@type": "Question",
        name: "What platforms does StageFlo support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "StageFlo runs on macOS (Apple Silicon and Intel) and Windows 10/11.",
        },
      },
      {
        "@type": "Question",
        name: "Does StageFlo work offline?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. StageFlo works fully offline, including its AI semantic search feature which runs a local ONNX model in-process — no internet connection required during a service.",
        },
      },
      {
        "@type": "Question",
        name: "What languages does StageFlo support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "StageFlo supports multilingual church services. The AI search works across English, Malayalam, Hindi, Tamil, Telugu, and more. You can run bilingual or multilingual worship with different languages on projector, stage, and livestream outputs.",
        },
      },
      {
        "@type": "Question",
        name: "Is StageFlo useful for Indian and diaspora churches?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. StageFlo supports Indian and diaspora church workflows as part of its wider multilingual focus, including Malayalam, Hindi, Tamil, Telugu, English, bilingual lyrics, scripture projection, stage display, and livestream lower-thirds.",
        },
      },
      {
        "@type": "Question",
        name: "How does the remote stage view work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "With one click, StageFlo generates a public internet URL via Cloudflare Tunnel for your stage display and remote controller. Share it with musicians or speakers anywhere — no account, no port-forwarding, no static IP needed.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use StageFlo for OBS streaming?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. StageFlo has a built-in OBS lower-thirds output, letting you push song titles and speaker names directly into your livestream.",
        },
      },
      {
        "@type": "Question",
        name: "How is StageFlo different from ProPresenter or EasyWorship?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "StageFlo is free forever for the first 100 churches (early adopters keep it free for life; paid plans come later), includes offline AI semantic search for Bible and songs, and offers one-click internet-accessible stage view via Cloudflare Tunnel — features not available in ProPresenter or EasyWorship without additional cost or setup.",
        },
      },
    ],
  };

  return (
    <div className="site-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareAppStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      <TopNav
        brandLabel="StageFlo"
        brandHref="#home"
        links={[
          { label: "Features", href: "#features" },
          { label: "Screenshots", href: "#screenshots" },
          { label: "Docs", href: "/docs/introduction/" },
          { label: "Supporters", href: "/supporters/" },
          { label: "Feedback", href: "/feedback/" },
        ]}
      />

      <main className="page-main">

        {/* ── Hero ── */}
        <section className="hero" id="home">
          <div className="hero-badges">
            <p className="eyebrow">StageFlo by Zac Studios · v{latestMac.version}</p>
              <span className="eyebrow eyebrow-ai">✦ AI Search — New in 2.0</span>
            <span className="eyebrow eyebrow-remote">📡 Remote Stage View — New in 2.0</span>
            <span className="eyebrow">✨ Live Visuals — New in 2.1</span>
          </div>
          <h1>Multilingual worship software for every church.</h1>
          <p className="lead">
            Run worship slides in English, Malayalam, Hindi, Tamil, Telugu, and more from one fast workflow. Songs, scripture, media, stage display, and OBS lower-thirds — free forever for the first 100 churches.
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
          <FreeSpotsCounter />
        </section>

        {/* ── Feature Pillars ── */}
        <section className="pillars section-block" id="features">
          <div className="pillar-grid">
            {pillars.map((p) => (
              <article key={p.title} className={`pillar-card reveal${p.accent ? " pillar-card-accent" : ""}${p.accentTeal ? " pillar-card-accent-teal" : ""}`}>
                <div className="pillar-card-top">
                  <span className="pillar-icon" aria-hidden="true">{p.icon}</span>
                  {p.badge && <span className="pillar-badge">{p.badge}</span>}
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── AI Spotlight ── */}
        <section className="ai-spotlight section-block" id="ai-search">
          <div className="ai-spotlight-inner">
            <div className="ai-spotlight-header">
              <span className="eyebrow eyebrow-ai">New in 2.0</span>
              <h2>Search by meaning, not just words.</h2>
              <p className="lead">
                Type a theme, story, or feeling — StageFlo finds the right passages and songs across every language you work in. No internet required.
              </p>
            </div>
            <div className="ai-query-examples">
              <div className="ai-query-chip">women at the well → <span>John 4:1–26</span></div>
              <div className="ai-query-chip">prodigal son → <span>Luke 15:11–32</span></div>
              <div className="ai-query-chip">ദൈവ സ്നേഹം → <span>Malayalam songs</span></div>
              <div className="ai-query-chip">grace and mercy → <span>Songs + Psalms</span></div>
            </div>
            <ul className="ai-feature-list">
              {aiFeatures.map((f) => (
                <li key={f.text}>
                  <span className="ai-feature-icon" aria-hidden="true">{f.icon}</span>
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Remote Stage View Spotlight ── */}
        <section className="remote-spotlight section-block" id="remote-stage">
          <div className="ai-spotlight-inner">
            <div className="ai-spotlight-header">
              <span className="eyebrow eyebrow-remote">New in 2.0</span>
              <h2>Your stage, anywhere in the world.</h2>
              <p className="lead">
                StageFlo generates a secure public internet link for your stage display and remote controller in one click — no account, no port-forwarding, no static IP. Send it to musicians before the service starts.
              </p>
            </div>
            <ul className="remote-feature-list">
              {remoteFeatures.map((f) => (
                <li key={f.text}>
                  <span className="ai-feature-icon" aria-hidden="true">{f.icon}</span>
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Live Visuals Spotlight ── */}
        <section className="ai-spotlight section-block" id="live-visuals">
          <div className="ai-spotlight-inner">
            <div className="ai-spotlight-header">
              <span className="eyebrow">New in 2.1</span>
              <h2>Bring your worship to life.</h2>
              <p className="lead">
                Transform your worship experience with built-in audio-reactive visuals. Choose from 10 stunning presets that move and breathe in sync with your music. Fine-tune colours, speed, glow, and intensity to match your atmosphere — or layer a photo or video underneath for something truly unique. Everything saves automatically, so your visuals are ready the moment you open your service.
              </p>
            </div>
            <ul className="ai-feature-list">
              {visualizerFeatures.map((f) => (
                <li key={f.text}>
                  <span className="ai-feature-icon" aria-hidden="true">{f.icon}</span>
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
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

        {/* ── What's New in 2.0 ── */}
        <section className="new-features section-block" id="whats-new">
          <div className="section-head">
            <p className="eyebrow">What&rsquo;s new</p>
            <h2>More power, less complexity.</h2>
            <p>From offline AI search to audio-reactive live visuals — powerful new capabilities shipped as free updates.</p>
          </div>
          <div className="new-features-grid">
            {newFeatures.map((f) => (
              <article key={f.label} className={`new-feature-card reveal${f.badge ? " new-feature-card-highlight" : ""}`}>
                <div className="new-feature-card-top">
                  <h4>{f.label}</h4>
                  {f.badge && <span className="new-feature-badge">{f.badge}</span>}
                </div>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Church Use Cases ── */}
        <section className="section-block" id="church-presentation-software">
          <div className="section-head">
            <p className="eyebrow">Multilingual church presentation software</p>
            <h2>Built for churches that worship in more than one language.</h2>
            <p>
              StageFlo helps multilingual, multicultural, Indian, diaspora, and international
              worship teams prepare lyrics, Bible verses, media, stage confidence views, and livestream overlays from one free app.
            </p>
          </div>
          <div className="new-features-grid">
            {churchUseCases.map((item) => (
              <article key={item.title} className="new-feature-card reveal">
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Alternatives ── */}
        <section className="section-block" id="propresenter-openlp-easyworship-alternative">
          <div className="section-head">
            <p className="eyebrow">Free worship software alternative</p>
            <h2>Looking for a ProPresenter, OpenLP, or EasyWorship alternative?</h2>
            <p>
              StageFlo is designed for churches that need reliable worship projection software
              without complicated setup or recurring software costs.
            </p>
          </div>
          <div className="new-features-grid">
            {comparisonPoints.map((item) => (
              <article key={item.title} className="new-feature-card reveal">
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="faq section-block" id="faq">
          <div className="section-head">
            <h2>Frequently asked questions</h2>
          </div>
          <div className="faq-list">
            {faqStructuredData.mainEntity.map((item) => (
              <details key={item.name} className="faq-item">
                <summary>{item.name}</summary>
                <p>{item.acceptedAnswer.text}</p>
              </details>
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
        <div className="footer-company">
          <Image
            src="/brand/zac-studios-logo.png"
            alt="Zac Studios"
            width={150}
            height={46}
            className="company-logo"
          />
          <p>StageFlo by Zac Studios.</p>
        </div>
        <small>
          <a href="/feedback/">Feedback</a>
          {" · "}
          <Link href="/docs/introduction/">Docs</Link>
          {" · "}
          <Link href="/supporters/">Supporters</Link>
          {" · "}
          <a href="https://github.com/zacstudios/Stageflo.app" target="_blank" rel="noopener noreferrer">GitHub</a>
          {" · "}
          <a href="mailto:zac@stageflo.app">zac@stageflo.app</a>
        </small>
      </footer>
    </div>
  );
}
