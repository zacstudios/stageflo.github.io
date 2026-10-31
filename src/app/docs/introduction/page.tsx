import type { Metadata } from "next";
import Link from "next/link";
import TopNav from "../../components/topNav";
import styles from "./page.module.css";
import Figure from "./figure";
import SectionHeading from "./sectionHeading";

const docSections = [
  { id: "what-is-stageflo", label: "What Is StageFlo" },
  { id: "whats-new", label: "What Is New" },
  { id: "core-workflow", label: "Core Workflow" },
  { id: "songs-key-bpm", label: "Songs, Key & BPM" },
  { id: "bible-browser", label: "Bible" },
  { id: "backgrounds", label: "Backgrounds" },
  { id: "visualizer", label: "Visualizer" },
  { id: "slide-transitions", label: "Slide Transitions" },
  { id: "library-backups", label: "Library & Backups" },
  { id: "ai-semantic-search", label: "AI Semantic Search" },
  { id: "settings-remote", label: "Remote Control" },
  { id: "music-director", label: "Music Director Page" },
  { id: "bitfocus-presenter-remotes", label: "Bitfocus & Presenter Remotes" },
  { id: "remote-stage-view-over-internet", label: "Remote Stage View over Internet" },
  { id: "settings-display", label: "Display Settings" },
  { id: "settings-stage", label: "Stage Display" },
  { id: "settings-lowerthird", label: "Lower Third" },
  { id: "settings-screens", label: "Screens & Outputs" },
  { id: "settings-bible", label: "Bible Settings" },
  { id: "settings-songs", label: "Song Settings" },
  { id: "song-editing", label: "Song Editing" },
  { id: "chords", label: "Chords" },
  { id: "media-web-links", label: "Media & Web Links" },
  { id: "settings-shortcuts", label: "Hotkeys" },
  { id: "service-safety-tools", label: "Service Safety Tools" },
  { id: "outputs", label: "Outputs and Displays" },
  { id: "first-service", label: "Run Your First Service" },
  { id: "installation-troubleshooting", label: "Installation Troubleshooting" },
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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StageFlo Docs | Introduction",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StageFlo Docs | Introduction",
    description:
      "Introduction guide for StageFlo with workflow basics, outputs, mobile singer view, and first-service setup steps.",
    images: ["/og-image.png"],
  },
};

export default function DocsIntroductionPage() {
  const docCardClassName = `${styles.docCard} reveal`;

  return (
    <div className="site-shell">
      <TopNav
        brandLabel="StageFlo Docs"
        links={[
          { label: "Home", href: "/" },
          { label: "Downloads", href: "/downloads/" },
          { label: "Feedback", href: "/feedback/" },
          { label: "GitHub", href: "https://github.com/zacstudios/Stageflo.app", external: true },
        ]}
      />

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
          <section className={`${styles.docHero} reveal`} id="what-is-stageflo">
            <p className="eyebrow">Documentation</p>
            <h1>Introduction to StageFlo</h1>
            <p>
              StageFlo is a live worship presentation app for songs, scripture, media, and synchronized
              projector and stage outputs. Built for real service flow — fast prep, simple control,
              shared libraries, and confidence on stage.
            </p>
            <div className="hero-badges" aria-label="Docs highlights">
              <span className="eyebrow">Version 2.1.72</span>
              <span className="eyebrow">macOS &amp; Windows</span>
            </div>
            <div className={styles.linkRow}>
              <a className={styles.ghostLink} href="https://github.com/zacstudios/Stageflo.app#readme" target="_blank" rel="noopener noreferrer">
                Full README
              </a>
              <Link className={styles.ghostLink} href="/feedback/">
                Ask for Help
              </Link>
            </div>
          </section>

          <section className={docCardClassName} id="whats-new">
            <SectionHeading sectionId="whats-new" title="What Is New" />
            <p>Highlights from the latest releases, newest first. StageFlo also shows these in Help → What&apos;s New after an update.</p>
            <h3>2.1.72</h3>
            <ul>
              <li><strong>Drag a visualizer onto slides</strong> — drag a look from the Visualizer tab onto a slide, song, or Bible passage to use it as the background. It is saved with the song, passage, or plan item.</li>
              <li><strong>A stronger beat pulse, with an off switch</strong> — the visualizer pulse is about three times stronger. The <strong>Pulse</strong> switch next to Tap turns the flashes off without losing your BPM.</li>
              <li><strong>Better Tap</strong> — taps count when you press, three taps set the BPM, and <strong>T</strong> taps the beat from the keyboard.</li>
              <li><strong>Adjust pictures and videos</strong> — right-click a background and choose <strong>Adjust look…</strong> for brightness, saturation, and blur.</li>
              <li><strong>Song numbers on the phone remote</strong> — the remote finds a song by its CCLI or VerseVIEW number, just like the app.</li>
            </ul>
            <h3>2.1.71</h3>
            <ul>
              <li><strong>Tap the beat</strong> from the song&apos;s Key · BPM button or the music director page; three taps set the BPM.</li>
              <li><strong>The visualizer keeps to the song&apos;s beat</strong> while a song with a BPM is live. Switch <strong>Follow song</strong> to <strong>Own BPM</strong> to keep it separate.</li>
              <li><strong>Standby on the Go Live button</strong> — a blue outline while the audience screen is open but black or cleared. Click it to go live again.</li>
              <li>StageFlo reopens maximized if it was maximized, and floating outputs reopen where you left them.</li>
            </ul>
          </section>

          <section className={docCardClassName} id="core-workflow">
            <SectionHeading sectionId="core-workflow" title="Core Workflow" />
            <p>Most teams use this sequence every week:</p>
            <ol>
              <li>Build a service plan with songs, scriptures, media, and custom slides.</li>
              <li>Style text and backgrounds in the editor.</li>
              <li>Preview transitions and timing in operator view.</li>
              <li>Go live to projector and stage displays.</li>
              <li>Control slides with hotkeys or the phone remote.</li>
            </ol>
            <Figure
              src="/screenshots/docs/workspace.png"
              alt="StageFlo workspace with the song library, slide grid, Sunday plan, and audience preview."
              caption="The workspace: library on the left, slides in the middle, the service plan below, and the audience preview on the right."
              width={2880}
              height={1760}
            />
          </section>

          <section className={docCardClassName} id="songs-key-bpm">
            <SectionHeading sectionId="songs-key-bpm" title="Songs, Key & BPM" />
            <p>
              Open the Songs tab in the library to search by title, lyrics, or song number. Click a song to
              preview it, then use <strong>Add to Plan</strong> or go live.
            </p>
            <ul>
              <li><strong>Song numbers</strong> — type a CCLI or VerseVIEW number to put that song first. This works the same on the phone remote.</li>
              <li><strong>Key and BPM</strong> — the <strong>Key · BPM</strong> button in the song header opens the key picker, BPM, and <strong>Tap</strong>. Changing the key transposes the chords on stage and on the music director page.</li>
              <li><strong>Tap</strong> — tap on the beat to line up every beat pulse with the band. Three taps in time set the BPM; double presses are ignored and a pause of more than 2 seconds starts a new count.</li>
              <li><strong>Per-service changes</strong> — a key or BPM chosen while a plan item is open is saved on that plan item, not on the library song.</li>
            </ul>
            <Figure
              src="/screenshots/docs/songs.png"
              alt="Song library with the Key and BPM panel open above the slides."
              caption="The Key · BPM panel: key, BPM, and Tap for the open song."
              width={2880}
              height={1760}
            />
          </section>

          <section className={docCardClassName} id="bible-browser">
            <SectionHeading sectionId="bible-browser" title="Bible" />
            <p>
              Open the Bible tab to browse books and chapters or search. Type a reference such as
              <code>John 3:16-18</code> or <code>Mark 14 8</code> and press Enter to put it live; a chapter on
              its own or a word search opens in the preview instead.
            </p>
            <ul>
              <li><strong>Parallel translations</strong> — show up to two more translations alongside the primary one.</li>
              <li><strong>Cross references</strong> — related verses for the open passage appear under the preview.</li>
              <li><strong>Verse ranges in plans</strong> — add a whole passage to the plan; it remembers its translation and layout.</li>
            </ul>
            <Figure
              src="/screenshots/docs/bible.png"
              alt="Psalm 23 open from the plan, with the audience preview and cross references."
              caption="A Bible passage from the plan, with cross references under the preview."
              width={2880}
              height={1760}
            />
          </section>

          <section className={docCardClassName} id="backgrounds">
            <SectionHeading sectionId="backgrounds" title="Backgrounds" />
            <p>
              The Background tab holds your pictures and videos. Click <strong>Import</strong> to add files, then
              click a background to put it behind the current song or passage.
            </p>
            <ul>
              <li><strong>Adjust look…</strong> — right-click a background to change its brightness, saturation, and blur. The output follows as you drag, and the settings are kept in backups.</li>
              <li><strong>Clear BG</strong> — removes the background from the current item.</li>
              <li><strong>Readability</strong> — use Dim and the Shadow, Panel, or Bars text backing in the preview panel to keep lyrics readable over busy pictures.</li>
            </ul>
            <Figure
              src="/screenshots/docs/backgrounds.png"
              alt="Background tab with four backgrounds and the Adjust look panel open."
              caption="Right-click a background and choose Adjust look… for brightness, saturation, and blur."
              width={2880}
              height={1760}
            />
          </section>

          <section className={docCardClassName} id="visualizer">
            <SectionHeading sectionId="visualizer" title="Visualizer" />
            <p>
              The Visualizer tab makes moving backgrounds that need no video files: Aurora, Nebula, Water,
              Kaleido, and many more, each with palettes, motion, and symmetry settings.
            </p>
            <ul>
              <li><strong>Use it</strong> — click a look to apply it, or drag it onto a slide, song, or Bible passage. <strong>Surprise</strong> picks a random look.</li>
              <li><strong>Beat</strong> — set a BPM, press <strong>Tap</strong> on the beat (or the <strong>T</strong> key), and the visual pulses in time. While a song with a BPM is live, the visualizer follows the song&apos;s beat; switch <strong>Follow song</strong> to <strong>Own BPM</strong> to keep it separate.</li>
              <li><strong>Pulse</strong> — switch the beat flashes off without losing the BPM or Autopilot.</li>
              <li><strong>Mic</strong> — let the visual react to the sound in the room. With no BPM set, kicks and strong hits make it pulse; with a BPM, the pulse stays on the BPM and the mic drives the movement and glow.</li>
              <li><strong>Favourites</strong> — save a look with the star tab and export or import looks to share them.</li>
            </ul>
            <Figure
              src="/screenshots/docs/visualizer.png"
              alt="Visualizer tab with the Aurora look applied to Amazing Grace."
              caption="The Aurora look behind a song. Tap, Pulse, BPM, and Follow song sit in the toolbar."
              width={2880}
              height={1760}
            />
          </section>

          <section className={docCardClassName} id="slide-transitions">
            <SectionHeading sectionId="slide-transitions" title="Slide Transitions" />
            <p>
              Choose how text animates between slides from the transition picker in the workspace toolbar.
              It applies to the audience preview and every live output.
            </p>
            <div className={styles.quickGrid}>
              <article className={styles.quickCard}>
                <h3>Transition Types</h3>
                <ul>
                  <li><strong>Cut</strong> — instant change.</li>
                  <li><strong>Fade</strong>, <strong>Dissolve</strong>, <strong>Fade Up</strong>, <strong>Fade Down</strong> — soft changes.</li>
                  <li><strong>Slide Left / Right / Up / Down</strong> — text slides in from a side.</li>
                  <li><strong>Zoom In</strong>, <strong>Zoom Out</strong> — text scales in or out.</li>
                  <li><strong>Flip</strong>, <strong>Bounce</strong>, <strong>Blur</strong> — livelier changes.</li>
                </ul>
              </article>
              <article className={styles.quickCard}>
                <h3>How It Works</h3>
                <ul>
                  <li>Transitions apply to the <strong>text layer</strong>; backgrounds change on their own.</li>
                  <li>Saving a plan item keeps its transition, so each item can bring back its own.</li>
                  <li>Use <strong>Cut</strong> for fast-moving moments and <strong>Fade</strong> for a calm feel.</li>
                </ul>
              </article>
            </div>
          </section>

          <section className={docCardClassName} id="library-backups">
            <SectionHeading sectionId="library-backups" title="Library & Backups" />
            <p>
              Found in Settings → Backup &amp; Restore. This is where you choose the active library folder,
              consolidate media, export plans, and create full backups.
            </p>
            <div className={styles.quickGrid}>
              <article className={styles.quickCard}>
                <h3>Library Folder</h3>
                <p>
                  StageFlo can store plans, songs, custom slides, and managed media in a folder you choose.
                  You can place that folder in Google Drive, OneDrive, Dropbox, an external drive, or a
                  network share so another PC can use the same library after sync completes.
                </p>
              </article>
              <article className={styles.quickCard}>
                <h3>One PC at a Time</h3>
                <p>
                  Shared folders are designed for moving between machines, not for live multi-user editing.
                  StageFlo uses a library lock and warns or blocks opening when another app instance appears
                  to be using the same library, which helps prevent cloud-sync conflicts.
                </p>
              </article>
              <article className={styles.quickCard}>
                <h3>Changing Libraries</h3>
                <p>
                  Choosing a new library shows progress while StageFlo validates the folder and prepares the
                  database. If the folder already contains a StageFlo library, StageFlo can use it after the
                  current app exits cleanly. Restart the app to open the selected library.
                </p>
              </article>
              <article className={styles.quickCard}>
                <h3>Recovery</h3>
                <p>
                  If the database is missing, invalid, or unreachable, StageFlo should show a recoverable
                  error instead of crashing. Reconnect the drive or cloud folder, choose another valid library,
                  or return to the default local library.
                </p>
              </article>
            </div>
            <h3>Export Types</h3>
            <ul>
              <li><strong>Portable Plan Export (.sfplan)</strong> — exports the selected plan plus everything needed to open that plan on another PC, including songs, custom slides, and referenced media/assets.</li>
              <li><strong>Library Backup (.sfbackup)</strong> — plans, songs, Bible data, settings, custom slides, and media references. It does not include the media files themselves.</li>
              <li><strong>Portable Library Backup (.sfportable)</strong> — everything in a Library Backup plus local media, backgrounds, and overlays, for moving to another PC.</li>
              <li><strong>Consolidate Existing Media</strong> — copies old local file references into the selected library folder so another PC can use them from the shared library.</li>
            </ul>
            <div className={styles.callout}>
              Large media files can make backups slow and heavy. For large libraries, keep the active
              library in a synced folder and use full backups as restore points rather than exporting them
              after every service.
            </div>
            <Figure
              src="/screenshots/docs/settings-backup.png"
              alt="Settings, Backup and Restore: library folder, library backup, and portable backup."
              caption="Settings → Backup & Restore."
              width={1920}
              height={1400}
            />
          </section>

          {/* ── AI Semantic Search ── */}
          <section className={docCardClassName} id="ai-semantic-search">
            <SectionHeading sectionId="ai-semantic-search" title="AI Semantic Search" />
            <p>
              StageFlo can search by meaning, not only exact words. This helps teams find songs and
              scripture quickly even when they remember ideas, stories, or themes instead of exact text.
            </p>
            <ul>
              <li><strong>Meaning-first search</strong> — queries like “women at the well” can find John 4 without exact phrase matching.</li>
              <li><strong>Multilingual support</strong> — works across English, Malayalam, Hindi, Tamil, Telugu, and more.</li>
              <li><strong>Fully offline</strong> — semantic model runs locally in-app; no cloud dependency during service.</li>
              <li><strong>Bible + songs</strong> — results can include both scripture and song matches in one workflow.</li>
              <li><strong>Keyword fallback</strong> — Bible and song search indexes are rebuilt in the background so title, lyric, and scripture searches stay fast.</li>
            </ul>
            <div className={styles.callout}>
              Turn AI search on in Settings → Search. If keyword search returns nothing, open the AI tab in
              the Song Library and search by topic, mood, story, or theme.
            </div>
          </section>

          {/* ── Remote Control ── */}
          <section className={docCardClassName} id="settings-remote">
            <SectionHeading sectionId="settings-remote" title="Settings — Remote Control" />
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
                  Generates a live public URL for both remote controller and stage view. StageFlo first
                  attempts a permanent <code>.stageflo.app</code> hostname (supports custom slug), then
                  falls back to a temporary <code>trycloudflare.com</code> URL if needed. QR codes are
                  provided for both links.
                </p>
              </article>
            </div>
            <div className={styles.callout}>
              <strong>PIN Protection</strong> — Set a PIN in Remote → Security to restrict access to the
              controller. Leave blank for open access on trusted local networks.
            </div>
            <div className={styles.callout}>
              The Remote Slides tab supports manual scrolling. When you scroll by hand, StageFlo pauses
              automatic active-slide scrolling briefly, then resumes following the live slide.
            </div>
            <Figure
              src="/screenshots/docs/settings-remote.png"
              alt="Settings, Remote: local server running with QR codes for the stage view and remote control."
              caption="Settings → Remote. Scan a QR code to open the stage view or the remote on a phone."
              width={1920}
              height={1400}
            />
            <div className={styles.phoneRow}>
              <Figure
                src="/screenshots/docs/remote.png"
                alt="Phone remote showing the live song with previous, Live, and next buttons."
                caption="The remote's Control tab follows the live slide."
                width={780}
                height={1688}
              />
              <Figure
                src="/screenshots/docs/remote-songs.png"
                alt="Phone remote song search finding Amazing Grace by its song number."
                caption="Search songs by title, lyrics, or song number."
                width={780}
                height={1688}
              />
            </div>
          </section>

          <section className={docCardClassName} id="music-director">
            <SectionHeading sectionId="music-director" title="Music Director Page" />
            <p>
              The music director page gives your band leader the live song with chords, the plan, and the
              key and BPM controls on their own phone. Open <code>/md</code> from the remote address and
              enter the music director PIN, set in Settings → Remote → Music Director.
            </p>
            <ul>
              <li><strong>Key and BPM</strong> — change the key or BPM for the live song or for songs later in the plan.</li>
              <li><strong>Tap</strong> — tap the beat so every screen&apos;s pulse lines up with the band.</li>
              <li><strong>Separate access</strong> — the music director PIN cannot control slides, and the operator&apos;s remote PIN does not open this page.</li>
              <li>If the operator locks key and BPM, the music director&apos;s taps still line up the beat but leave the BPM alone.</li>
            </ul>
            <div className={styles.phoneRow}>
              <Figure
                src="/screenshots/docs/music-director.png"
                alt="Music director page showing Amazing Grace with chords, key, BPM, and Tap."
                caption="The live song with chords, key, BPM, and Tap."
                width={780}
                height={1688}
              />
            </div>
          </section>

          <section className={docCardClassName} id="bitfocus-presenter-remotes">
            <SectionHeading sectionId="bitfocus-presenter-remotes" title="Bitfocus & Presenter Remotes" />
            <p>
              StageFlo can also be driven from Bitfocus Companion, Stream Deck through Companion, or a
              standard PowerPoint-style presenter stick.
            </p>
            <div className={styles.quickGrid}>
              <article className={styles.quickCard}>
                <h3>Bitfocus Companion</h3>
                <p>
                  In Companion, add the <strong>Generic HTTP Requests</strong> connection. Create one
                  button per command and use <code>GET</code> requests to the StageFlo computer on port{" "}
                  <code>50111</code>.
                </p>
                <ul>
                  <li><code>/remote/companion/next</code> — next slide</li>
                  <li><code>/remote/companion/prev</code> — previous slide</li>
                  <li><code>/remote/companion/go-live</code> — send preview live to projector</li>
                  <li><code>/remote/companion/go-live-stage</code> — send preview live to stage</li>
                  <li><code>/remote/companion/black</code> — black screen</li>
                  <li><code>/remote/companion/clear</code> — clear screen</li>
                  <li><code>/remote/companion/close-outputs</code> — close projector and stage outputs</li>
                  <li><code>/remote/companion/close-projector</code> — close the projector output only</li>
                  <li><code>/remote/companion/close-stage</code> — close the stage output only</li>
                  <li><code>/remote/companion/stage-message</code> — show a message on the stage display</li>
                </ul>
              </article>
              <article className={styles.quickCard}>
                <h3>Presenter Stick</h3>
                <p>
                  Most USB or Bluetooth presenter sticks act like a keyboard. Keep the StageFlo main
                  window focused and use the clicker normally.
                </p>
                <ul>
                  <li><strong>Next</strong> — <code>Space</code>, <code>ArrowRight</code>, <code>ArrowDown</code>, or <code>PageDown</code></li>
                  <li><strong>Previous</strong> — <code>ArrowLeft</code>, <code>ArrowUp</code>, or <code>PageUp</code></li>
                  <li><strong>Go live</strong> — <code>G</code> or <code>Enter</code></li>
                  <li><strong>Black screen</strong> — <code>B</code> or <code>.</code>, matching PowerPoint-style blank/black behavior</li>
                  <li><strong>Clear screen</strong> — <code>C</code> or <code>Escape</code></li>
                </ul>
              </article>
            </div>
            <div className={styles.callout}>
              Full Companion URL example:{" "}
              <code>http://192.168.1.25:50111/remote/companion/next</code>. Replace the IP address with
              the StageFlo computer shown in Settings → Remote.
            </div>
            <div className={styles.callout}>
              If Remote PIN protection is enabled, add <code>?pin=1234</code> to the URL or send an{" "}
              <code>X-StageFlow-Pin</code> header from Companion. <code>previous</code>, <code>back</code>,{" "}
              <code>blank</code>, <code>blackout</code>, <code>go-live</code>, and <code>live</code> also work as
              command names. Keep the remote port on a trusted local
              network unless you intentionally enable StageFlo&apos;s public remote link.
            </div>
          </section>

          {/* ── Remote Stage View over Internet ── */}
          <section className={docCardClassName} id="remote-stage-view-over-internet">
            <SectionHeading sectionId="remote-stage-view-over-internet" title="Remote Stage View over Internet" />
            <p>
              Use this when your musicians or speakers are outside your local network. StageFlo can
              generate a public link via Cloudflare Tunnel so remote users can access both stage view and
              controller securely.
            </p>
            <div className={styles.quickGrid}>
              <article className={styles.quickCard}>
                <h3>How to Share</h3>
                <ol>
                  <li>Open Settings → Remote.</li>
                  <li>Enable Public Link mode.</li>
                  <li>Copy the generated base URL.</li>
                  <li>Share <code>/stage</code> for singers and <code>/remote</code> for control.</li>
                </ol>
              </article>
              <article className={styles.quickCard}>
                <h3>Custom/Public Link Notes</h3>
                <ul>
                  <li>Preferred mode uses a permanent <code>.stageflo.app</code> hostname.</li>
                  <li>You can set a custom slug for your permanent public link.</li>
                  <li>If permanent link setup fails, StageFlo can use a temporary <code>trycloudflare.com</code> fallback.</li>
                  <li>Treat this link as a live control surface during service time.</li>
                  <li>Always use PIN protection before sharing outside trusted teams.</li>
                </ul>
              </article>
            </div>
            <div className={styles.callout}>
              Best practice: share <code>/stage</code> broadly, but share <code>/remote</code> only with
              operators who should control slides.
            </div>
          </section>

          {/* ── Display Settings ── */}
          <section className={docCardClassName} id="settings-display">
            <SectionHeading sectionId="settings-display" title="Settings — Display" />
            <p>Controls typography and slide layout for all outputs. Found in Settings → Display.</p>
            <ul>
              <li><strong>Font</strong> — Choose the typeface used across all slide text.</li>
              <li><strong>Size</strong> — Base font size for slide text.</li>
              <li><strong>Style</strong> — Weight and style variations (bold, regular, etc.).</li>
              <li><strong>Alignment</strong> — Horizontal text alignment for slide content.</li>
              <li><strong>Color</strong> — Default text color applied to new slides.</li>
            </ul>
            <p>
              <strong>Audience Standby</strong> sets what the audience screen shows when it is cleared: nothing,
              a colour, or a picture or video. <strong>Language Font Mapping</strong> picks a font per language,
              for example a Malayalam font for Malayalam lyrics.
            </p>
            <div className={styles.callout}>
              Use the Reset button in Display Settings to restore factory defaults if slide layouts look
              incorrect after a font change.
            </div>
            <Figure
              src="/screenshots/docs/settings-display.png"
              alt="Settings, Display: font size, style, colour, and language font mapping."
              caption="Settings → Display."
              width={1920}
              height={1400}
            />
          </section>

          {/* ── Stage Display ── */}
          <section className={docCardClassName} id="settings-stage">
            <SectionHeading sectionId="settings-stage" title="Settings — Stage Display" />
            <p>
              Configures the confidence monitor shown to speakers and musicians on stage. Found in
              Settings → Display, under Stage Display.
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
              <li><strong>Show Chords</strong> — Show chord rows on stage and remote confidence views when songs contain chord markers.</li>
              <li><strong>Show BPM Pulse</strong> — Pulse the song&apos;s beat on the stage display, stage link, phone remote, and music director page.</li>
            </ul>
            <Figure
              src="/screenshots/docs/stage-view.png"
              alt="Stage view showing the live verse of Amazing Grace, the next verse, key, and BPM."
              caption="The stage view: the live verse, the next one, key and BPM, clock, timer, and message."
              width={2560}
              height={1440}
            />
          </section>

          {/* ── Lower Third ── */}
          <section className={docCardClassName} id="settings-lowerthird">
            <SectionHeading sectionId="settings-lowerthird" title="Settings — Lower Third" />
            <p>
              Configures the lower-third overlay for live streaming. Found in Settings → Lower
              Third. Use the static URL in OBS as a browser source.
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
          <section className={docCardClassName} id="settings-screens">
            <SectionHeading sectionId="settings-screens" title="Settings — Screens & Outputs" />
            <p>
              Routes content to the Audience, Stage, Lower Third, and Center Stage outputs. Found in
              Settings → Screens.
            </p>
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
                <h3>Alpha &amp; Chroma Key</h3>
                <p>Key the output for broadcast or video mixing: alpha keying with key and fill colours, or a chroma key colour for switchers that expect one.</p>
              </article>
              <article className={styles.quickCard}>
                <h3>NDI Output</h3>
                <p>Send the output as an NDI stream on the local network. Set a source name and framerate. NDI receivers (e.g. OBS NDI plugin) can pick up the feed directly.</p>
              </article>
            </div>
            <Figure
              src="/screenshots/docs/settings-screens.png"
              alt="Settings, Screens: audience output assigned to Screen 1, with NDI output below."
              caption="Settings → Screens. The yellow note appears when two outputs share one screen."
              width={1920}
              height={1400}
            />
          </section>

          {/* ── Bible ── */}
          <section className={docCardClassName} id="settings-bible">
            <SectionHeading sectionId="settings-bible" title="Settings — Bible" />
            <p>
              Manage Bible translations used in presentations. Found in Settings → Bible.
            </p>
            <ul>
              <li><strong>Download a Translation</strong> — Browse available translations, select a version, and download it directly into StageFlo. No external files needed.</li>
              <li><strong>Import XML</strong> — Import a Zefania-format or compatible Bible XML file. Useful for languages not available in the built-in library.</li>
              <li><strong>Installed Translations</strong> — View and delete installed translations to manage storage.</li>
              <li><strong>Verse Ranges</strong> — Add a full chapter, one verse such as John 1:1, or a range such as John 1:1-6.</li>
            </ul>
            <div className={styles.callout}>
              For multilingual services, install multiple translations. You can switch the active Bible
              while building slides without leaving the app.
            </div>
          </section>

          {/* ── Songs ── */}
          <section className={docCardClassName} id="settings-songs">
            <SectionHeading sectionId="settings-songs" title="Settings — Songs" />
            <p>Import, export, and manage your song database. Found in Settings → Songs.</p>
            <ul>
              <li><strong>Song Pack</strong> — Import a pre-built song pack (OpenLyrics XML format) to populate your library instantly. Language packs for Malayalam, Tamil, Hindi, and others are available.</li>
              <li><strong>Import Songs</strong> — Import individual songs or bulk XML files from your file system.</li>
              <li><strong>Export Songs</strong> — Export your entire library as an XML file for backup or sharing with another StageFlo installation.</li>
              <li><strong>Online Lyrics Search</strong> — Search online from the song library and import lyrics when a suitable source is found.</li>
              <li><strong>Library Updates</strong> — StageFlo checks installed song packs and Bible editions every six hours (not while live) and updates songs you have not edited. Use <strong>Check now</strong> to run it straight away.</li>
              <li><strong>Song Usage</strong> — see which songs went live in a period, with their CCLI / VerseVIEW numbers, and export a CSV for licence reporting.</li>
              <li><strong>Delete All Songs</strong> — Clears the entire database. Use before re-importing a clean pack.</li>
            </ul>
            <div className={styles.callout}>
              Imported online lyrics can preserve section labels such as Verse, Chorus, Bridge, and
              parenthesized labels like (Chorus) when the source text includes them.
            </div>
            <Figure
              src="/screenshots/docs/settings-songs.png"
              alt="Settings, Songs: library updates, duplicate handling, and OpenLyrics import and export."
              caption="Settings → Songs."
              width={1920}
              height={1400}
            />
          </section>

          <section className={docCardClassName} id="song-editing">
            <SectionHeading sectionId="song-editing" title="Song Editing" />
            <p>
              The song editor is built for fast copy-paste entry when you already have a full song text.
            </p>
            <ul>
              <li><strong>Smart Split</strong> — Paste a full song into Primary Lyrics or Transliteration and StageFlo can split it into verse/chorus sections.</li>
              <li><strong>Number Cleanup</strong> — Leading verse numbers such as “1”, “2”, “3” are removed from pasted verse text.</li>
              <li><strong>Transliteration Matching</strong> — Pasting transliteration can fill existing verse boxes instead of creating duplicate sections.</li>
              <li><strong>Undo</strong> — Cmd+Z on macOS and Ctrl+Z on Windows restore recent song-editor text changes.</li>
              <li><strong>Slide Number Loading</strong> — Press slide numbers as hotkeys. Use 1-9 for single digits and type multi-digit numbers for slides 10 and above.</li>
            </ul>
            <div className={styles.callout}>
              In Manual line mode, leave a blank line between two lyric lines to force a slide break
              there — useful for giving one impactful line its own slide without changing the
              lines-per-slide setting for the rest of the song.
            </div>
          </section>

          <section className={docCardClassName} id="chords">
            <SectionHeading sectionId="chords" title="Chords" />
            <p>
              StageFlo supports ChordPro-style chord markers inside song lyrics or transliteration, while
              keeping congregation slides clean.
            </p>
            <div className={styles.quickGrid}>
              <article className={styles.quickCard}>
                <h3>How to Enter</h3>
                <p>
                  Add chords inline with square brackets, for example <code>[G]Lord I [D]lift</code>.
                  StageFlo reads the markers as chord data and strips them from normal audience lyrics.
                </p>
              </article>
              <article className={styles.quickCard}>
                <h3>Where Chords Show</h3>
                <p>
                  Chords can show on Stage Display and Remote confidence views when Settings → Display →
                  Stage Display → Show Chords is enabled. Projector and lower-third outputs show clean lyrics.
                </p>
              </article>
            </div>
            <div className={styles.callout}>
              Chord imports from third-party databases are not bundled. Add or edit chords directly in the
              song text so your own library stays clear and predictable.
            </div>
          </section>

          <section className={docCardClassName} id="media-web-links">
            <SectionHeading sectionId="media-web-links" title="Media & Web Links" />
            <p>
              Media, backgrounds, overlays, and web slides are managed through the library so services can
              move cleanly between machines.
            </p>
            <ul>
              <li><strong>Managed Media</strong> — Media added to custom slides, backgrounds, and overlays is copied into the active library folder.</li>
              <li><strong>Portable Plans</strong> — Portable plan exports include referenced media and custom presentations needed by that plan.</li>
              <li><strong>Full Backups</strong> — Full library backups include managed media, backgrounds, overlays, plans, songs, and custom slides.</li>
              <li><strong>Web Link Slides</strong> — Web slides can load normal embeddable webpages when the site allows framing.</li>
              <li><strong>YouTube Removed</strong> — YouTube-specific media integration was removed because embedded playback can be blocked by sign-in, bot checks, CSP restrictions, and unreliable controls.</li>
            </ul>
            <div className={styles.callout}>
              Some websites block being shown inside another app or browser frame. If a web link does not
              load, test a different page or use a captured media file instead.
            </div>
          </section>

          {/* ── Hotkeys ── */}
          <section className={docCardClassName} id="settings-shortcuts">
            <SectionHeading sectionId="settings-shortcuts" title="Settings — Hotkeys" />
            <p>
              Change the keys for live control in Settings → Hotkeys. Click + on any action to add a key, or
              × to remove one. Reset restores the defaults.
            </p>
            <div className={styles.quickGrid}>
              <article className={styles.quickCard}>
                <h3>Slides &amp; Outputs</h3>
                <ul>
                  <li><strong>Next slide</strong> — Space, →, ↓, Page Down</li>
                  <li><strong>Previous slide</strong> — ←, ↑, Page Up</li>
                  <li><strong>Go live audience</strong> — G or Enter</li>
                  <li><strong>Go live stage</strong> — S</li>
                  <li><strong>Black screen</strong> — B or .</li>
                  <li><strong>Clear screen</strong> — C or Escape</li>
                  <li><strong>Lock outputs</strong> — Cmd/Ctrl+L</li>
                  <li><strong>Restore outputs</strong> — Cmd/Ctrl+R</li>
                  <li><strong>Close outputs</strong> — no key by default</li>
                </ul>
              </article>
              <article className={styles.quickCard}>
                <h3>Layers &amp; Beat</h3>
                <ul>
                  <li><strong>Background</strong> — Shift+B</li>
                  <li><strong>Media</strong> — Shift+M</li>
                  <li><strong>Text</strong> — Shift+T</li>
                  <li><strong>Timer</strong> — Shift+K</li>
                  <li><strong>Overlay</strong> — Shift+O</li>
                  <li><strong>Dim background</strong> — Shift+D</li>
                  <li><strong>Text backing</strong> — Shift+P</li>
                  <li><strong>Tap beat</strong> — T</li>
                </ul>
              </article>
            </div>
            <div className={styles.callout}>
              Hotkeys are ignored while you type in a text box. To turn all of them off, use the Hotkeys
              button at the top of the main window or the switch in Settings → Hotkeys.
            </div>
            <Figure
              src="/screenshots/docs/settings-hotkeys.png"
              alt="Settings, Hotkeys: next slide, previous slide, go live, black, and clear with their keys."
              caption="Settings → Hotkeys."
              width={1920}
              height={1400}
            />
          </section>

          {/* ── Service Safety Tools ── */}
          <section className={docCardClassName} id="service-safety-tools">
            <SectionHeading sectionId="service-safety-tools" title="Service Safety Tools" />
            <ul>
              <li><strong>Output Lock</strong> — lock output windows to avoid accidental screen changes during service.</li>
              <li><strong>Standby</strong> — Black or Clear keeps the audience screen open; the Go Live button shows a blue Standby outline. Click it to go live again.</li>
              <li><strong>Preview first</strong> — clicking a song or passage opens it in the preview; nothing reaches the audience until you go live.</li>
            </ul>
            <div className={styles.callout}>
              Output Lock quick keys: <strong>Cmd+L</strong> to lock, <strong>Cmd+R</strong> to restore.
            </div>
          </section>

          {/* ── Outputs ── */}
          <section className={docCardClassName} id="outputs">
            <SectionHeading sectionId="outputs" title="Outputs and Displays" />
            <ul>
              <li><strong>Projector</strong> — Full-screen congregation output for lyrics, scripture, and media.</li>
              <li><strong>Stage Display</strong> — Confidence monitor for speakers and musicians with current + next slide context.</li>
              <li><strong>Lower Third</strong> — Overlay stream for song titles and speaker names in OBS or broadcast tools.</li>
              <li><strong>Mobile Stage View</strong> — Open <code>/stage</code> from the Remote URL on any phone — singers see live lyrics without a dedicated monitor.</li>
              <li><strong>Layer Controls</strong> — Black, Clear, and Restore controls for instant live transitions.</li>
            </ul>
          </section>

          {/* ── First Service ── */}
          <section className={docCardClassName} id="first-service">
            <SectionHeading sectionId="first-service" title="Run Your First Service" />
            <ol>
              <li>Install StageFlo from the downloads page and launch the app.</li>
              <li>In Settings → Songs, import a song pack or add songs manually.</li>
              <li>In Settings → Bible, download or import a translation.</li>
              <li>Build a service plan with 2–3 songs and one scripture passage.</li>
              <li>Open Settings → Screens and assign your audience and stage outputs.</li>
              <li>Choose a library folder in Settings → Backup &amp; Restore if you want the same library available on another PC.</li>
              <li>Open Remote settings, copy the stage URL, and open it on a mobile device for the singer view.</li>
              <li>Practice Next/Previous with the hotkeys or the phone remote before going live.</li>
            </ol>
          </section>

          {/* ── Installation Troubleshooting ── */}
          <section className={docCardClassName} id="installation-troubleshooting">
            <SectionHeading sectionId="installation-troubleshooting" title="Installation Troubleshooting" />
            <div className={styles.callout}>
              <strong>Install blocked by macOS or Windows?</strong> Use these quick steps to open StageFlo safely.
            </div>

            <h3>macOS: &quot;StageFlo can&apos;t be opened&quot; or &quot;Apple could not verify&quot;</h3>
            <ol>
              <li>Download StageFlo and move it to <code>Applications</code>.</li>
              <li>Try opening it once from Applications (this may show a warning).</li>
              <li>Open <strong>System Settings → Privacy &amp; Security</strong>.</li>
              <li>Scroll to Security and click <strong>Open Anyway</strong> for StageFlo.</li>
              <li>Open StageFlo again and click <strong>Open</strong> when prompted.</li>
            </ol>
            <p>
              Alternative method: in Finder, Control-click StageFlo in Applications, choose <strong>Open</strong>,
              then click <strong>Open</strong> again.
            </p>

            <h3>Windows: SmartScreen &quot;Windows protected your PC&quot;</h3>
            <ol>
              <li>Run the StageFlo installer.</li>
              <li>When SmartScreen appears, click <strong>More info</strong>.</li>
              <li>Click <strong>Run anyway</strong>.</li>
              <li>If asked by User Account Control, click <strong>Yes</strong>.</li>
              <li>Complete setup, then launch StageFlo from Start Menu.</li>
            </ol>
            <p>
              If your organization blocks unsigned apps, ask your IT admin to allow StageFlo.
            </p>
          </section>

          {/* ── Troubleshooting ── */}
          <section className={docCardClassName} id="troubleshooting">
            <SectionHeading sectionId="troubleshooting" title="Troubleshooting" />
            <ul>
              <li>Remote page doesn&apos;t load — confirm app and device are on the same local network, or switch to Public Link mode in Remote settings.</li>
              <li>Output on wrong screen — re-assign displays in Settings → Screens and reopen the output windows.</li>
              <li>Cloudflare tunnel fails to start — check internet connectivity; allow outbound access to Cloudflare tunnel endpoints. If permanent hostname setup fails, use fallback temporary link.</li>
              <li>Shared library will not open — reconnect the cloud/network drive, wait for sync to finish, or choose the default local library from Settings → Backup &amp; Restore.</li>
              <li>Another PC is using the library — close StageFlo on the other machine before opening the shared library here.</li>
              <li>Media file missing — consolidate existing media or re-import the file so StageFlo can copy it into the active library.</li>
              <li>Web link slide is blank — the website may block embedding. Use a different embeddable page or add the content as media.</li>
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
