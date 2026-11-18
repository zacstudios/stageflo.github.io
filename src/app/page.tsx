import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FreeSpotsCounter from "./components/freeSpotsCounter";
import GatedDownloadLink from "./components/gatedDownloadLink";
import TopNav from "./components/topNav";
import {
  CURRENT_VERSION,
  MAC_ARM64_DOWNLOAD_URL,
  MAC_X64_DOWNLOAD_URL,
  WINDOWS_DOWNLOAD_URL,
  readLatestMacReleaseManifest,
  readLatestReleaseManifest,
  toMacDmgUrl,
  toWindowsSetupUrl,
} from "./lib/downloads";

const pillars = [
  {
    icon: "🎵",
    title: "Songs & Scripture in Every Language",
    desc: "Lyrics and Bible verses in English, Malayalam, Hindi, Tamil, Telugu and more, side by side, with transliteration and parallel versions. Find any song or verse in seconds.",
  },
  {
    icon: "🗂️",
    accent: true,
    title: "Service Plans in Sections",
    desc: "Build the order of service in sections with planned times and notes, start each week from a template, and move through it with one key or a clicker.",
    badge: "New in 2.1.81",
  },
  {
    icon: "🖥️",
    accent: true,
    title: "Every Screen, Its Own Look",
    desc: "Projector, stage monitor, lower third, Center Stage and NDI, each with the right look — both languages in the room, one line low on the livestream.",
    badge: "New in 2.1.81",
  },
  {
    icon: "📱",
    accentTeal: true,
    title: "The Team on Their Phones",
    desc: "One QR code: singers read the words, the band leader sets keys and BPM, the operator runs slides — on the church Wi-Fi or over the internet.",
  },
  {
    icon: "✦",
    title: "AI Search, Offline",
    desc: "Search the Bible and your songs by meaning — “women at the well” finds John 4 — in every language you use, without an internet connection.",
  },
  {
    icon: "✨",
    title: "Live Visuals",
    desc: "Audio-reactive backgrounds that move with the music, with your own colours, or blended with a photo or video.",
  },
];

const aiFeatures = [
  { icon: "🔍", text: "Search by meaning — “women at the well” finds John 4 without the exact words" },
  { icon: "🌏", text: "Works across English, Malayalam, Hindi, Tamil, Telugu and more" },
  { icon: "📴", text: "Runs on your computer — no internet needed during the service" },
  { icon: "📖", text: "Your Bible and songs are ready to search as soon as they're added" },
];

const remoteFeatures = [
  { icon: "🔗", text: "One QR code opens the stage link, the music director page and the phone remote" },
  { icon: "🌍", text: "On the church Wi-Fi, or over the internet with a stageflo.app link" },
  { icon: "📱", text: "Singers see the live words, chords, next slide and timers on any phone" },
  { icon: "🔒", text: "A PIN for the remote; the stage link can have its own PIN, or none — it only reads" },
];

const visualizerFeatures = [
  { icon: "🎵", text: "Presets such as Aurora, Nebula, Bloom and Liquid, all moving with live audio" },
  { icon: "🎨", text: "Your own colours, speed, glow and brightness" },
  { icon: "🖼️", text: "Blend a photo or video under the visuals" },
  { icon: "💾", text: "Saved with each song or plan item, ready every week" },
];

const newFeatures = [
  {
    label: "Plan Sections, Times & Templates",
    desc: "Build the service as a tree of sections with planned times, colours and team notes, save it as a template, and print the order of service.",
    guide: "/guides/sections/",
  },
  {
    label: "A Look for Every Output",
    desc: "Choose the languages, fonts, sizes, position and background for each screen, the NDI stream or Center Stage — such as one line low on the livestream.",
    guide: "/guides/livestream-look/",
  },
  {
    label: "Simpler Screen Setup",
    desc: "Identify your screens, add one in three questions, check what shows when cleared, then press Apply — nothing moves until you do.",
    guide: "/guides/set-up-screens/",
  },
  {
    label: "Stage Layouts per Screen",
    desc: "Chords and timing on the band monitor, a large current and next slide at the pulpit — both following the same service.",
    guide: "/guides/stage-layout/",
  },
  {
    label: "One Address for the Team",
    desc: "One QR code for the stage link, music director and phone remote, with separate PINs for the operator and the readers.",
    guide: "/guides/team-phones/",
  },
  {
    label: "Safer Plan Imports",
    desc: "A plan from another computer keeps its own lyrics and slides when yours differ, and the import tells you what it changed.",
    guide: "/guides/share-plan/",
  },
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
    title: "Audience Output",
    body: "Lyrics over a moving visualizer background.",
    src: "/screenshots/projector-stage.png",
    alt: "StageFlo audience output showing Amazing Grace over the Aurora visualizer.",
  },
  {
    title: "Stage Display",
    body: "Current and next slide for speakers and musicians.",
    src: "/screenshots/stage-display.png",
    alt: "StageFlo stage view showing the live verse, the next verse, key, and BPM.",
  },
];

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
    readLatestMacReleaseManifest(),
    readLatestReleaseManifest("latest.yml"),
  ]);

  const latestMac = macManifest ?? {
    version: CURRENT_VERSION,
    arm64Url: MAC_ARM64_DOWNLOAD_URL,
    x64Url: MAC_X64_DOWNLOAD_URL,
  };
  const latestMacArm64DownloadUrl = toMacDmgUrl(latestMac.arm64Url, latestMac.version, "arm64");
  const latestMacX64DownloadUrl = toMacDmgUrl(latestMac.x64Url, latestMac.version, "x64");
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
      "Order-of-service plan sections and templates",
      "Per-output looks and per-screen stage layouts",
      "Guided multi-screen output setup",
      "Section timing, notes, and printable service plans",
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
    downloadUrl: [latestMacArm64DownloadUrl, latestMacX64DownloadUrl, latestWindowsDownloadUrl],
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
          text: "StageFlo shows one QR code for the whole team. It opens a page with the stage link (live words, chords and timers for singers and band), the music director page and the phone remote, each with its own PIN choice. It works on the church Wi-Fi, or anywhere over a secure stageflo.app link, with no account or router setup.",
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
      />

      <main className="page-main">

        {/* ── Hero ── */}
        <section className="hero" id="home">
          <div className="hero-badges">
            <Link className="eyebrow" href="#whats-new">
              StageFlo {`v${latestMac.version}`} · New: plan sections and a look for every screen →
            </Link>
          </div>
          <h1>Multilingual worship software for every church.</h1>
          <p className="lead">
            Run worship slides in English, Malayalam, Hindi, Tamil, Telugu, and more from one fast workflow. Songs, scripture, media, stage display, and OBS lower-thirds — free forever for the first 100 churches.
          </p>
          <div className="cta-row">
            <GatedDownloadLink
              className="button button-primary"
              href={latestMacArm64DownloadUrl}
              source="desktop"
              formTitle="Download StageFlo for macOS (Apple Silicon)"
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
          <p className="cta-mac-arch-note">
            Mac button is for Apple Silicon (M1–M4). On an Intel Mac?{" "}
            <GatedDownloadLink
              className="download-gate-inline-link"
              href={latestMacX64DownloadUrl}
              source="desktop"
              formTitle="Download StageFlo for macOS (Intel)"
            >
              Get the Intel build
            </GatedDownloadLink>
          </p>
          <p className="cta-mac-arch-note">
            New to StageFlo?{" "}
            <Link className="download-gate-inline-link" href="/guides/">
              Follow the step-by-step guides
            </Link>
            , with a picture of every step.
          </p>
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

        {/* ── What's New in 2.1.81 ── */}
        <section className="new-features section-block" id="whats-new">
          <div className="section-head">
            <p className="eyebrow">What&rsquo;s new in 2.1.81</p>
            <h2>Plan the service. Route every screen. Keep everyone in step.</h2>
            <p>
              Organise the order of service into sections, give every screen the right look, and run the room
              from the desktop or a phone without the screens drifting apart.
            </p>
          </div>
          <div className="new-features-grid">
            {newFeatures.map((f) => (
              <article key={f.label} className="new-feature-card new-feature-card-highlight reveal">
                <div className="new-feature-card-top">
                  <h4>{f.label}</h4>
                </div>
                <p>{f.desc}</p>
                <Link className="new-feature-guide" href={f.guide}>
                  Step-by-step guide →
                </Link>
              </article>
            ))}
          </div>
          <div className="cta-row">
            <Link className="button button-primary" href="/guides/">
              All step-by-step guides
            </Link>
            <Link className="button button-secondary" href="/docs/introduction/#whats-new">
              Everything in 2.1.81
            </Link>
          </div>
        </section>

        {/* ── AI Spotlight ── */}
        <section className="ai-spotlight section-block" id="ai-search">
          <div className="ai-spotlight-inner">
            <div className="ai-spotlight-header">
              <span className="eyebrow eyebrow-ai">AI search</span>
              <h2>Search by meaning, not just words.</h2>
              <p className="lead">
                Type a theme, story or feeling, and StageFlo finds the passages and songs, in every language you use. No internet needed.
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
              <span className="eyebrow eyebrow-remote">The team on their phones</span>
              <h2>Everyone on the same page, on their own phone.</h2>
              <p className="lead">
                One QR code gives singers the words, the band leader the keys and tempo, and the operator a phone remote. It works on the church Wi-Fi, or anywhere over a secure stageflo.app link — no account or router setup.
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
              <span className="eyebrow">Live visuals</span>
              <h2>Bring your worship to life.</h2>
              <p className="lead">
                Built-in visuals that move and breathe with the music. Pick a preset, make it yours, and it&apos;s ready every time you open the service.
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
              href={latestMacArm64DownloadUrl}
              source="desktop"
              formTitle="Download StageFlo for macOS (Apple Silicon)"
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
          <p className="cta-mac-arch-note">
            Mac button is for Apple Silicon (M1–M4). On an Intel Mac?{" "}
            <GatedDownloadLink
              className="download-gate-inline-link"
              href={latestMacX64DownloadUrl}
              source="desktop"
              formTitle="Download StageFlo for macOS (Intel)"
            >
              Get the Intel build
            </GatedDownloadLink>
          </p>
        </section>

      </main>

      <footer>
        <div className="footer-company">
          <Image
            src="/brand/zac-studios-logo-trim.png"
            alt="Zac Studios"
            width={1037}
            height={639}
            className="company-logo"
          />
          <p>StageFlo by Zac Studios.</p>
        </div>
        <small>
          <a href="/feedback/">Feedback</a>
          {" · "}
          <Link href="/docs/introduction/">Docs</Link>
          {" · "}
          <Link href="/guides/">Guides</Link>
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
