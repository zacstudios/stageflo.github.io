import type { Metadata } from "next";
import Link from "next/link";
import {
  CURRENT_VERSION,
  MAC_DOWNLOAD_URL,
  readLatestReleaseManifest,
  toMacDmgUrl,
} from "../../lib/downloads";

export const metadata: Metadata = {
  title: "Download StageFlo for macOS",
  description:
    "Download StageFlo for macOS, free worship presentation software for Indian and multilingual church presentation computers.",
  alternates: {
    canonical: "/downloads/mac/",
  },
  openGraph: {
    title: "Download StageFlo for macOS",
    description:
      "Free worship presentation software for Indian and multilingual church presentation computers.",
    url: "/downloads/mac/",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StageFlo macOS Downloads",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download StageFlo for macOS",
    description:
      "Free worship presentation software for Indian and multilingual church presentation computers.",
    images: ["/og-image.png"],
  },
};

export default async function MacDownloadsPage() {
  const macManifest = await readLatestReleaseManifest("latest-mac.yml");
  const latestMac = macManifest ?? { version: CURRENT_VERSION, url: MAC_DOWNLOAD_URL };
  const latestMacDownloadUrl = toMacDmgUrl(latestMac.url, latestMac.version);

  return (
    <div className="site-shell">
      <main className="page-main">
        <section className="hero downloads-hero downloads-direct-hero">
          <p className="eyebrow">macOS Download</p>
          <h1>Download StageFlo for Mac</h1>
          <p className="lead">
            Install StageFlo on macOS for worship lyrics, Bible verse projection, media,
            stage display, OBS lower-thirds, and remote control during Indian and multilingual church services.
          </p>
          <div className="cta-row">
            <a className="button button-primary" href={latestMacDownloadUrl}>
              Download macOS v{latestMac.version}
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
