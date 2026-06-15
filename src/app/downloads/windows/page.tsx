import type { Metadata } from "next";
import Link from "next/link";
import {
  CURRENT_VERSION,
  WINDOWS_DOWNLOAD_URL,
  readLatestReleaseManifest,
  toWindowsSetupUrl,
} from "../../lib/downloads";

export const metadata: Metadata = {
  title: "Download StageFlo for Windows",
  description:
    "Download StageFlo for Windows, free worship presentation software for Indian and multilingual church presentation PCs.",
  alternates: {
    canonical: "/downloads/windows/",
  },
  openGraph: {
    title: "Download StageFlo for Windows",
    description:
      "Free worship presentation software for Indian and multilingual Windows church presentation PCs.",
    url: "/downloads/windows/",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StageFlo Windows Downloads",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download StageFlo for Windows",
    description:
      "Free worship presentation software for Indian and multilingual Windows church presentation PCs.",
    images: ["/og-image.png"],
  },
};

export default async function WindowsDownloadsPage() {
  const windowsManifest = await readLatestReleaseManifest("latest.yml");
  const latestWindows = windowsManifest ?? { version: CURRENT_VERSION, url: WINDOWS_DOWNLOAD_URL };
  const latestWindowsDownloadUrl = toWindowsSetupUrl(latestWindows.url, latestWindows.version);

  return (
    <div className="site-shell">
      <main className="page-main">
        <section className="hero downloads-hero downloads-direct-hero">
          <p className="eyebrow">Windows Download</p>
          <h1>Download StageFlo for Windows</h1>
          <p className="lead">
            Install StageFlo on Windows for worship lyrics, Bible verse projection, media,
            stage display, OBS lower-thirds, and remote control during Indian and multilingual church services.
          </p>
          <div className="cta-row">
            <a className="button button-primary" href={latestWindowsDownloadUrl}>
              Download Windows v{latestWindows.version}
            </a>
            <Link className="button button-secondary" href="/downloads/">
              Back to Downloads Hub
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
