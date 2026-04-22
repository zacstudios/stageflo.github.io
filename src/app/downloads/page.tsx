import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GatedDownloadLink from "../components/gatedDownloadLink";
import {
  CURRENT_VERSION,
  MAC_DOWNLOAD_URL,
  WINDOWS_DOWNLOAD_URL,
  readLatestReleaseManifest,
  resourceDownloadCards,
  toMacDmgUrl,
  toWindowsSetupUrl,
} from "../lib/downloads";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Download StageFlo desktop installers and import-ready worship resources.",
  alternates: {
    canonical: "/downloads/",
  },
};

export default async function DownloadsPage() {
  const [macManifest, windowsManifest] = await Promise.all([
    readLatestReleaseManifest("latest-mac.yml"),
    readLatestReleaseManifest("latest.yml"),
  ]);

  const latestMac = macManifest ?? {
    version: CURRENT_VERSION,
    url: MAC_DOWNLOAD_URL,
  };
  const latestWindows = windowsManifest ?? {
    version: CURRENT_VERSION,
    url: WINDOWS_DOWNLOAD_URL,
  };

  const latestMacDownloadUrl = toMacDmgUrl(latestMac.url, latestMac.version);
  const latestWindowsDownloadUrl = toWindowsSetupUrl(latestWindows.url, latestWindows.version);

  return (
    <div className="site-shell">
      <header className="top-nav">
        <Link className="brand" href="/" aria-label="StageFlo home">
          <Image src="/stageflo-icon.png" alt="StageFlo" width={28} height={28} style={{ borderRadius: "0.55rem", background: "rgba(124, 58, 237, 0.35)", boxShadow: "0 0 0 1.5px rgba(196, 181, 253, 0.5), 0 2px 10px rgba(124, 58, 237, 0.4)" }} />
          <span>StageFlo</span>
        </Link>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/docs/introduction/">Docs</Link>
          <a href="#desktop">Desktop</a>
          <a href="#resources">Resources</a>
        </nav>
      </header>

      <main className="page-main">
        <section className="hero downloads-hero" id="top">
          <p className="eyebrow">Downloads</p>
          <h1>Choose StageFlo Installer or Import Resources</h1>
          <p className="lead">
            Desktop installers are lead-gated for release follow-up and support. Update feeds remain separate so app auto-updates keep working normally.
          </p>
          <div className="cta-row">
            <a className="button button-primary" href="#desktop">
              Choose Desktop Installer
            </a>
            <a className="button button-secondary" href="#resources">
              Browse Resource XMLs
            </a>
          </div>
        </section>

        <section className="section-block" id="desktop">
          <div className="section-head">
            <h2>Desktop Installers</h2>
            <p>
              Use the installer button for first-time setup on your platform.
            </p>
          </div>
          <div className="install-grid downloads-platform-grid">
            <article className="install-card reveal download-feature-card">
              <p className="downloads-card-tag">macOS</p>
              <h3>Universal macOS Build</h3>
              <p>
                Recommended for normal installs. You will get the latest stable desktop build and follow-up release communication.
              </p>
              <div className="cta-row downloads-card-actions">
                <GatedDownloadLink
                  className="button button-primary"
                  href={latestMacDownloadUrl}
                  source="desktop"
                  formTitle="Download StageFlo for macOS"
                >
                  Get macOS Installer
                </GatedDownloadLink>
              </div>
            </article>

            <article className="install-card reveal download-feature-card">
              <p className="downloads-card-tag">Windows</p>
              <h3>Windows Setup Installer</h3>
              <p>
                Best for first-time installs on Windows systems.
              </p>
              <div className="cta-row downloads-card-actions">
                <GatedDownloadLink
                  className="button button-primary"
                  href={latestWindowsDownloadUrl}
                  source="desktop"
                  formTitle="Download StageFlo for Windows"
                >
                  Get Windows Installer
                </GatedDownloadLink>
              </div>
            </article>
          </div>
        </section>

        <section className="install section-block" id="resources">
          <div className="section-head">
            <h2>Resource Downloads</h2>
            <p>
              Import-ready XML resources for songs and Bible workflows, kept visually aligned with the rest of the site.
            </p>
          </div>
          <div className="install-grid">
            {resourceDownloadCards.map((card) => (
              <article className="install-card reveal" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <a className="download-gate-inline-link" href={card.href} target="_blank" rel="noopener noreferrer">
                  {card.label}
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <p>StageFlo Downloads</p>
        <small>Desktop installers, resources, and direct recovery paths.</small>
        <small>
          <Link href="/privacy/">Privacy Policy</Link>
          {" • "}
          <a href="/updates/">Update Feed</a>
          {" • "}
          <a href="mailto:zac@stageflo.app">zac@stageflo.app</a>
        </small>
      </footer>
    </div>
  );
}