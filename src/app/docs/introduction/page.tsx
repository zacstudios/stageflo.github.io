import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

const docSections = [
  { id: "what-is-stageflo", label: "What Is StageFlo" },
  { id: "core-workflow", label: "Core Workflow" },
  { id: "settings-remote", label: "Remote Control" },
  { id: "settings-display", label: "Display Settings" },
  { id: "settings-stage", label: "Stage Display" },
  { id: "settings-lowerthird", label: "Lower Third" },
  { id: "settings-screens", label: "Screens & Outputs" },
  { id: "settings-bible", label: "Bible" },
  { id: "settings-songs", label: "Songs" },
  { id: "settings-shortcuts", label: "Keyboard Shortcuts" },
  { id: "outputs", label: "Outputs and Displays" },
  { id: "first-service", label: "Run Your First Service" },
  { id: "troubleshooting", label: "Troubleshooting" },
] as const;

export const metadata: Metadata = {
  title: "StageFlo Docs | Introduction",
  description:
    "Introduction guide for StageFlo with workflow basics, outputs, mobile singer view, and first-service setup steps.",
  alternates: {
    canonical: "/docs/introduction/",
  },
  openGraph: {
    title: "StageFlo Docs | Introduction",
    description:
      "Introduction guide for StageFlo with workflow basics, outputs, mobile singer view, and first-service setup steps.",
    url: "/docs/introduction/",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "StageFlo Docs | Introduction",
    description:
      "Introduction guide for StageFlo with workflow basics, outputs, mobile singer view, and first-service setup steps.",
  },
};

export default function DocsIntroductionPage() {
  return (
    <div className="site-shell">
      <header className="top-nav">
        <Link className="brand" href="/" aria-label="StageFlo home">
          <Image src="/stageflo-icon.png" alt="StageFlo" width={28} height={28} style={{ borderRadius: '0.55rem', background: 'rgba(124, 58, 237, 0.35)', boxShadow: '0 0 0 1.5px rgba(196, 181, 253, 0.5), 0 2px 10px rgba(124, 58, 237, 0.4)' }} />
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
              projector and stage outputs. Built for real service flow — fast prep, simple control,
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
              <li>Control slides with keyboard shortcuts or the remote controller.</li>
            </ol>
          </section>

          {/* ── Remote Control ── */}
          <section className={styles.docCard} id="settings-remote">
            <h2>Settings — Remote Control</h2>
            <p>
              Found in Settings → Remote. Control slides from any phone, tablet, or browser and show a
              stage monitor on any screen.
            </p>
            <div className={styles.quickGrid}>
              <article className={styles.quickCard}>
                <h3>Local Network</h3>
                <p>
                  Opens a local web server on your machine. Connect any device on the same Wi-Fi to the
                  shown URL or scan the QR code. Use <code>/remote</code> for the controller and{" "}
                  <code>/stage</code> for the singer view.
                </p>
              </article>
              <article className={styles.quickCard}>
                <h3>Public Link (Cloudflare)</h3>
                <p>
                  Generates a live public URL via Cloudflare Quick Tunnels — no account needed. One click
                  creates a <code>trycloudflare.com</code> address for both the remote controller and
                  stage view. QR codes are provided for both. Use this when devices are on different
                  networks or for off-site team access.
                </p>
              </article>
            </div>
            <div className={styles.callout}>
              <strong>PIN Protection</strong> — Set a PIN in Remote → Security to restrict access to the
              controller. Leave blank for open access on trusted local networks.
            </div>
          </section>

          {/* ── Display Settings ── */}
          <section className={styles.docCard} id="settings-display">
            <h2>Settings — Display</h2>
            <p>Controls typography and slide layout for all outputs. Found in Settings → Display.</p>
            <ul>
              <li><strong>Font</strong> — Choose the typeface used across all slide text.</li>
              <li><strong>Size</strong> — Base font size for slide text.</li>
              <li><strong>Style</strong> — Weight and style variations (bold, regular, etc.).</li>
              <li><strong>Alignment</strong> — Horizontal text alignment for slide content.</li>
              <li><strong>Color</strong> — Default text color applied to new slides.</li>
            </ul>
            <div className={styles.callout}>
              Use the Reset button in Display Settings to restore factory defaults if slide layouts look
              incorrect after a font change.
            </div>
          </section>

          {/* ── Stage Display ── */}
          <section className={styles.docCard} id="settings-stage">
            <h2>Settings — Stage Display</h2>
            <p>
              Configures the confidence monitor shown to speakers and musicians on stage. Found in
              Settings → Display → Stage Display.
            </p>
            <ul>
              <li><strong>Template</strong> — Choose a layout preset: <em>Classic</em> (full detail), <em>Focus</em> (larger text), or <em>Compact</em> (current slide only).</li>
              <li><strong>Accent Color</strong> — Highlight color for the active/current panel.</li>
              <li><strong>Show Clock</strong> — Toggle a live clock on the stage display.</li>
              <li><strong>Clock Format</strong> — 12-hour or 24-hour format.</li>
              <li><strong>Show Status</strong> — Show current presentation status (live, clear, black).</li>
              <li><strong>Show Next Slide</strong> — Preview the upcoming slide (disabled in Compact).</li>
              <li><strong>Show Stage Timer</strong> — Display a running stage timer.</li>
              <li><strong>Show Info Panel</strong> — Show operator notes and additional context.</li>
            </ul>
          </section>

          {/* ── Lower Third ── */}
          <section className={styles.docCard} id="settings-lowerthird">
            <h2>Settings — Lower Third</h2>
            <p>
              Configures the lower-third overlay for live streaming. Found in Settings → Display →
              Lower Third. Use the static URL in OBS as a browser source.
            </p>
            <ul>
              <li><strong>Style</strong> — Select a lower-third visual style. Each has its own description and URL.</li>
              <li><strong>Font</strong> — Typeface used for lower-third text.</li>
              <li><strong>Primary Color</strong> — Main text or accent color.</li>
              <li><strong>Secondary Color</strong> — Supporting color for subtitle or background elements.</li>
              <li><strong>Bottom Offset %</strong> — Vertical position from the bottom of the frame.</li>
              <li><strong>Panel Opacity</strong> — Transparency of the lower-third background panel.</li>
              <li><strong>Show Second Line</strong> — Toggle display of the subtitle/secondary text line.</li>
            </ul>
            <div className={styles.callout}>
              In OBS, add a Browser Source and paste the static lower-third URL from Settings. It updates
              in real time as slides change — no re-linking needed between services.
            </div>
          </section>

          {/* ── Screens & Outputs ── */}
          <section className={styles.docCard} id="settings-screens">
            <h2>Settings — Screens &amp; Outputs</h2>
            <p>Routes content to audience and stage displays. Found in Settings → Display → Screens.</p>
            <div className={styles.quickGrid}>
              <article className={styles.quickCard}>
                <h3>Screen Assignment</h3>
                <p>Assign each output (Projector, Stage, Lower Third) to a connected display. Use <strong>Identify Screens</strong> to show numbers on each monitor and <strong>Test Pattern</strong> to verify signal and alignment.</p>
              </article>
              <article className={styles.quickCard}>
                <h3>Output Modes</h3>
                <p><strong>Single</strong> — one display per output. <strong>Grouped / Edge Blend</strong> — span across multiple displays with column and overlap controls for multi-projector rigs.</p>
              </article>
              <article className={styles.quickCard}>
                <h3>Color Overlay</h3>
                <p>Tint the output with a solid color. Useful for matching projector color temperature or applying a stage wash effect.</p>
              </article>
              <article className={styles.quickCard}>
                <h3>Corner Pin</h3>
                <p>Keystone / perspective correction. Drag the four corners of the output to correct for angled projection surfaces.</p>
              </article>
              <article className={styles.quickCard}>
                <h3>Alpha Key</h3>
                <p>Enable alpha keying for broadcast or video mixing workflows. Choose key type, key color, and fill color for transparency compositing.</p>
              </article>
              <article className={styles.quickCard}>
                <h3>NDI Output</h3>
                <p>Send the output as an NDI stream on the local network. Set a source name and framerate. NDI receivers (e.g. OBS NDI plugin) can pick up the feed directly.</p>
              </article>
            </div>
          </section>

          {/* ── Bible ── */}
          <section className={styles.docCard} id="settings-bible">
            <h2>Settings — Bible</h2>
            <p>
              Manage Bible translations used in presentations. Found in Settings → Bible.
            </p>
            <ul>
              <li><strong>Download a Translation</strong> — Browse available translations, select a version, and download it directly into StageFlo. No external files needed.</li>
              <li><strong>Import XML</strong> — Import a Zefania-format or compatible Bible XML file. Useful for languages not available in the built-in library.</li>
              <li><strong>Installed Translations</strong> — View and delete installed translations to manage storage.</li>
            </ul>
            <div className={styles.callout}>
              For multilingual services, install multiple translations. You can switch the active Bible
              while building slides without leaving the app.
            </div>
          </section>

          {/* ── Songs ── */}
          <section className={styles.docCard} id="settings-songs">
            <h2>Settings — Songs</h2>
            <p>Import, export, and manage your song database. Found in Settings → Songs.</p>
            <ul>
              <li><strong>Song Pack</strong> — Import a pre-built song pack (OpenLyrics XML format) to populate your library instantly. Language packs for Malayalam, Tamil, Hindi, and others are available.</li>
              <li><strong>Import Songs</strong> — Import individual songs or bulk XML files from your file system.</li>
              <li><strong>Export Songs</strong> — Export your entire library as an XML file for backup or sharing with another StageFlo installation.</li>
              <li><strong>Delete All Songs</strong> — Clears the entire database. Use before re-importing a clean pack.</li>
            </ul>
          </section>

          {/* ── Keyboard Shortcuts ── */}
          <section className={styles.docCard} id="settings-shortcuts">
            <h2>Settings — Keyboard Shortcuts</h2>
            <p>
              Customise key bindings for live control. Found in Settings → Keyboard Shortcuts. Click the
              + icon on any action to capture a new key combo.
            </p>
            <ul>
              <li><strong>Next / Previous Slide</strong> — Advance or step back through the playlist.</li>
              <li><strong>Black Screen</strong> — Toggle a black output on all displays.</li>
              <li><strong>Clear</strong> — Clear slide content, showing the background or standby image.</li>
              <li><strong>Close Outputs</strong> — Close all output windows.</li>
              <li>All shortcuts can be reset to factory defaults with the Reset button.</li>
            </ul>
            <div className={styles.callout}>
              Toggle the Keyboard Shortcuts enable switch to temporarily disable all bindings — useful
              when typing in text fields during a live service.
            </div>
          </section>

          {/* ── Outputs ── */}
          <section className={styles.docCard} id="outputs">
            <h2>Outputs and Displays</h2>
            <ul>
              <li><strong>Projector</strong> — Full-screen congregation output for lyrics, scripture, and media.</li>
              <li><strong>Stage Display</strong> — Confidence monitor for speakers and musicians with current + next slide context.</li>
              <li><strong>Lower Third</strong> — Overlay stream for song titles and speaker names in OBS or broadcast tools.</li>
              <li><strong>Mobile Stage View</strong> — Open <code>/stage</code> from the Remote URL on any phone — singers see live lyrics without a dedicated monitor.</li>
              <li><strong>Layer Controls</strong> — Black, Clear, and Restore controls for instant live transitions.</li>
            </ul>
          </section>

          {/* ── First Service ── */}
          <section className={styles.docCard} id="first-service">
            <h2>Run Your First Service</h2>
            <ol>
              <li>Install StageFlo from the downloads page and launch the app.</li>
              <li>In Settings → Songs, import a song pack or add songs manually.</li>
              <li>In Settings → Bible, download or import a translation.</li>
              <li>Build a service plan with 2–3 songs and one scripture passage.</li>
              <li>Open Settings → Display → Screens and assign your projector and stage outputs.</li>
              <li>Open Remote settings, copy the stage URL, and open it on a mobile device for the singer view.</li>
              <li>Practice Next/Previous controls with keyboard shortcuts before going live.</li>
            </ol>
          </section>

          {/* ── Troubleshooting ── */}
          <section className={styles.docCard} id="troubleshooting">
            <h2>Troubleshooting</h2>
            <ul>
              <li>Remote page doesn&apos;t load — confirm app and device are on the same local network, or switch to Public Link mode in Remote settings.</li>
              <li>Output on wrong screen — re-assign displays in Settings → Screens and reopen the output windows.</li>
              <li>Cloudflare tunnel fails to start — check internet connectivity; the tunnel requires outbound access to <code>trycloudflare.com</code>.</li>
              <li>Media file missing — re-import the file; StageFlo references local paths so moved files need re-linking.</li>
              <li>Text too small on stage display — adjust font size in Display Settings and increase the base size.</li>
              <li>Bible not found after import — go to Settings → Bible, verify the translation shows in Installed, and restart the app if needed.</li>
            </ul>
            <div className={styles.linkRow}>
              <a className={styles.ghostLink} href="https://github.com/zacstudios/Stageflo.app/issues" target="_blank" rel="noopener noreferrer">
                Known Issues
              </a>
              <Link className={styles.ghostLink} href="/feedback/">
                Submit Feedback
              </Link>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}