const featureCards = [
  {
    title: "Library to Live in Seconds",
    body: "Search songs, browse scripture, queue media, then send to projector or stage without bouncing between screens.",
  },
  {
    title: "Advanced Slide Editing",
    body: "Design rich lyric and scripture slides with layered text styling, spacing controls, and per-plan visual overrides.",
  },
  {
    title: "Built for Multi-Output Teams",
    body: "Control congregation output, stage confidence display, and lower-third overlays in one synchronized workflow.",
  },
  {
    title: "Service-Safe Reliability",
    body: "Desktop-first architecture with local data and fast rendering designed for live services where timing matters.",
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

const downloadCards = [
  {
    title: "Download for macOS",
    body: "Use the latest StageFlo universal DMG hosted directly on stageflo.app. macOS auto-update files are published from the desktop app pipeline.",
    href: "/downloads/mac/",
    label: "Open Mac Downloads",
  },
  {
    title: "Download for Windows",
    body: "Use the latest StageFlo setup EXE hosted directly on stageflo.app. Windows installers are copied from the private main branch build pipeline.",
    href: "/downloads/windows/",
    label: "Open Windows Downloads",
  },
  {
    title: "Updater Feed",
    body: "StageFlo checks the update feed hosted at stageflo.app for packaged macOS builds. The feed lives under the stable /updates path.",
    href: "/updates/",
    label: "View Update Feed Info",
  },
];

const screenshotCards = [
  {
    title: "Operator Workspace",
    body: "Playlist planning, preview panel, and live controls.",
    src: "screenshots/operator-workspace.png",
    alt: "StageFlo operator workspace with library, playlist, and preview panels.",
  },
  {
    title: "Slide Editor",
    body: "Layer styling, typography tuning, and visual overrides.",
    src: "screenshots/slide-editor.png",
    alt: "StageFlo slide editor showing text and layout styling controls.",
  },
  {
    title: "Projector and Stage Output",
    body: "Readable congregation output with confidence monitor support.",
    src: "screenshots/projector-stage.png",
    alt: "StageFlo projector and stage output displays during a live presentation.",
  },
  {
    title: "Stage Display Focus",
    body: "Live current and next-slide confidence view for speakers and musicians.",
    src: "screenshots/stage-display.png",
    alt: "StageFlo stage display view showing current and next slide panels.",
  },
];

export default function Home() {
  return (
    <div className="site-shell">
      <header className="top-nav">
        <a className="brand" href="#home" aria-label="StageFlo home">
          <img src="stageflo-icon.png" alt="StageFlo" width={30} height={30} />
          <span>StageFlo</span>
        </a>
        <nav>
          <a href="#features">Features</a>
          <a href="#screenshots">Screenshots</a>
          <a href="#install">Install</a>
          <a href="#community">Community</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <p className="eyebrow">Worship Presentation Software</p>
          <h1>Run Songs, Scripture, Media, and Multi-Screen Output from One Flow</h1>
          <p className="lead">
            StageFlo helps worship teams prepare and present with confidence across operator,
            projector, stage, and lower-third displays.
          </p>
          <div className="cta-row">
            <a
              className="button button-primary"
              href="/downloads/mac/"
            >
              Download for macOS
            </a>
            <a
              className="button button-secondary"
              href="/downloads/windows/"
            >
              Download for Windows
            </a>
          </div>
        </section>

        <section className="install" id="downloads">
          <div className="section-head">
            <h2>Desktop Downloads</h2>
            <p>
              StageFlo desktop builds are published from the private main branch and copied to this site without exposing source code.
            </p>
          </div>
          <div className="install-grid">
            {downloadCards.map((card) => (
              <article className="install-card reveal" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <a href={card.href}>{card.label}</a>
              </article>
            ))}
          </div>
        </section>

        <section className="feature-grid" id="features">
          {featureCards.map((feature) => (
            <article key={feature.title} className="card reveal">
              <h2>{feature.title}</h2>
              <p>{feature.body}</p>
            </article>
          ))}
        </section>

        <section className="screenshots" id="screenshots">
          <div className="section-head">
            <h2>Inside StageFlo</h2>
            <p>Real screenshots from StageFlo workflows used during live services.</p>
          </div>
          <div className="shot-grid">
            {screenshotCards.map((shot) => (
              <figure key={shot.src} className="shot reveal">
                <img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" />
                <figcaption>
                  <h3>{shot.title}</h3>
                  <p>{shot.body}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="install" id="install">
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
                <a
                  href={
                    platform === "macOS"
                      ? "/downloads/mac/"
                      : "/downloads/windows/"
                  }
                >
                  Open Downloads
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="community" id="community">
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
            <a
              className="button button-secondary"
              href="https://github.com/zacstudios/stageflo/discussions"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discussions
            </a>
            <a
              className="button button-secondary"
              href="https://github.com/zacstudios/stageflo/issues"
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
      </footer>
    </div>
  );
}
