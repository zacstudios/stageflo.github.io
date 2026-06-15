import type { Metadata } from "next";
import Link from "next/link";
import GatedDownloadLink from "../components/gatedDownloadLink";
import TopNav from "../components/topNav";
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
  title: "Download StageFlo for Mac and Windows",
  description:
    "Download StageFlo, free multilingual worship presentation software for churches on macOS and Windows.",
  alternates: {
    canonical: "/downloads/",
  },
  openGraph: {
    title: "Download StageFlo for Mac and Windows",
    description:
      "Free multilingual worship presentation software for churches on macOS and Windows.",
    url: "/downloads/",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StageFlo Downloads",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download StageFlo for Mac and Windows",
    description:
      "Free multilingual worship presentation software for churches on macOS and Windows.",
    images: ["/og-image.png"],
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
      <TopNav
        brandLabel="StageFlo"
        links={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs/introduction/" },
          { label: "Desktop", href: "#desktop" },
          { label: "Resources", href: "#resources" },
        ]}
      />

      <main className="page-main">
        <section className="hero downloads-hero" id="top">
          <p className="eyebrow">Downloads</p>
          <h1>Download StageFlo Worship Presentation Software</h1>
          <p className="lead">
            Get the free StageFlo desktop app for macOS or Windows. Use it to run worship
            lyrics, Bible verses, media, projector output, stage display, and OBS lower-thirds
            for multilingual, multicultural, and international church services.
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
            <h2>Desktop installers for multilingual church presentation teams</h2>
            <p>
              Use the installer button for first-time setup on your platform. StageFlo is free
              worship software for churches, multilingual worship teams, and live-service operators.
            </p>
          </div>
          <div className="install-grid downloads-platform-grid">
            <article className="install-card reveal download-feature-card">
              <p className="downloads-card-tag">macOS</p>
              <h3>Universal macOS Build</h3>
              <p>
                Recommended for Mac church presentation computers. You will get the latest stable
                desktop build for English, Malayalam, Hindi, Tamil, Telugu, and other bilingual worship slides.
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
                Best for first-time installs on Windows presentation PCs used for multilingual worship slides,
                Bible readings, stage display, and livestream lower-thirds.
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
