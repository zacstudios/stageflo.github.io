import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

const docSections = [
  { id: "what-is-stageflo", label: "What Is StageFlo" },
  { id: "core-workflow", label: "Core Workflow" },
  { id: "mobile-singer-view", label: "Mobile Singer View" },
  { id: "outputs", label: "Outputs and Displays" },
  { id: "content", label: "Songs, Bible, and Media" },
  { id: "first-service", label: "Run Your First Service" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "next", label: "Next Steps" },
] as const;

export const metadata: Metadata = {
  title: "StageFlo Docs | Introduction",
  description:
    "Introduction guide for StageFlo with workflow basics, outputs, mobile singer view, and first-service setup steps.",
};

export default function DocsIntroductionPage() {
  return (
    <div className="site-shell">
      <header className="top-nav">
        <Link className="brand" href="/" aria-label="StageFlo home">
          <img src="/stageflo-icon.png" alt="StageFlo" width={30} height={30} />
          <span>StageFlo Docs</span>
        </Link>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/downloads/">Downloads</Link>
          <Link href="/feedback/">Feedback</Link>
          <a href="https://github.com/zacstudios/Stageflo.app" target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
      </header>

      <main className={styles.docsMain}>
        <aside className={styles.sidebar}>
          <h2>Introduction</h2>
          <nav aria-label="Documentation sections">
            {docSections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        <article className={styles.content}>
          <section className={styles.docHero} id="what-is-stageflo">
            <p className="eyebrow">Documentation</p>
            <h1>Introduction to StageFlo</h1>
            <p>
              StageFlo is a live worship presentation app for songs, scripture, media, and synchronized
              projector and stage outputs. It is built for real service flow: fast prep, simple control,
              and confidence on stage.
            </p>
            <div className={styles.linkRow}>
              <a className={styles.ghostLink} href="https://github.com/zacstudios/Stageflo.app#readme" target="_blank" rel="noopener noreferrer">
                Full README
              </a>
              <Link className={styles.ghostLink} href="/feedback/">
                Ask for Help
              </Link>
            </div>
          </section>

          <section className={styles.docCard} id="core-workflow">
            <h2>Core Workflow</h2>
            <p>Most teams use this sequence every week:</p>
            <ol>
              <li>Build a service plan with songs, scriptures, media, and custom slides.</li>
              <li>Style text and backgrounds in the editor.</li>
              <li>Preview transitions and timing in operator view.</li>
              <li>Go live to projector and stage displays.</li>
              <li>Control slides with keyboard shortcuts or remote control.</li>
            </ol>
          </section>

          <section className={styles.docCard} id="mobile-singer-view">
            <h2>Mobile Singer View (On Stage)</h2>
            <p>
              StageFlo includes a mobile-friendly singer view designed for phones and tablets on stage.
              Singers can see current and next lyrics without needing a dedicated monitor for every person.
            </p>
            <div className={styles.callout}>
              Use the remote/singer URL from settings, open it on mobile devices connected to the same network,
              and keep performers synchronized with the live slide flow.
            </div>
            <div className={styles.quickGrid}>
              <article className={styles.quickCard}>
                <h3>Best For</h3>
                <p>Worship leaders, vocalists, and musicians who need glanceable lyric confidence while moving.</p>
              </article>
              <article className={styles.quickCard}>
                <h3>Shows</h3>
                <p>Current lyric line, upcoming lyric line, and real-time updates from the operator view.</p>
              </article>
            </div>
          </section>

          <section className={styles.docCard} id="outputs">
            <h2>Outputs and Displays</h2>
            <ul>
              <li>Projector output for congregation lyrics and media.</li>
              <li>Stage display for speakers and singers (current and next context).</li>
              <li>Lower-third overlay workflows for streaming and OBS scenes.</li>
              <li>Layer controls for black, clear, restore, and live transitions.</li>
            </ul>
          </section>

          <section className={styles.docCard} id="content">
            <h2>Songs, Bible, and Media</h2>
            <ul>
              <li>Song library with search by title, artist, or lyrics.</li>
              <li>Bible lookup and slide creation with XML import support.</li>
              <li>Custom slides for announcements and service moments.</li>
              <li>Media support for images and videos in service flow.</li>
              <li>Multilingual preparation for bilingual and multilingual churches.</li>
            </ul>
          </section>

          <section className={styles.docCard} id="first-service">
            <h2>Run Your First Service</h2>
            <ol>
              <li>Install StageFlo from the downloads page.</li>
              <li>Add 2-3 songs and one scripture passage to a new plan.</li>
              <li>Open projector and stage outputs and verify the target screen selection.</li>
              <li>Open singer remote view on one mobile device and confirm lyrics sync.</li>
              <li>Practice next and previous controls before going live.</li>
            </ol>
          </section>

          <section className={styles.docCard} id="troubleshooting">
            <h2>Troubleshooting</h2>
            <ul>
              <li>If a remote page does not load, confirm app and device are on the same local network.</li>
              <li>If output windows appear on the wrong display, re-open outputs after selecting monitors.</li>
              <li>If media is missing, re-import the file and verify local path availability.</li>
              <li>If text appears too small on stage, adjust display font scaling and preview again.</li>
            </ul>
          </section>

          <section className={styles.docCard} id="next">
            <h2>Next Steps</h2>
            <p>
              Continue with setup details and feature-specific guidance in the project documentation and issue tracker.
            </p>
            <div className={styles.linkRow}>
              <a className={styles.ghostLink} href="https://github.com/zacstudios/Stageflo.app#readme" target="_blank" rel="noopener noreferrer">
                Setup Docs
              </a>
              <a className={styles.ghostLink} href="https://github.com/zacstudios/Stageflo.app/issues" target="_blank" rel="noopener noreferrer">
                Known Issues
              </a>
              <Link className={styles.ghostLink} href="/feedback/">
                Submit Feedback
              </Link>
            </div>
            <p className={styles.footerNote}>StageFlo documentation is actively evolving with community input.</p>
          </section>
        </article>
      </main>
    </div>
  );
}