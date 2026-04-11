import type { Metadata } from "next";
import Link from "next/link";
import {
  CURRENT_VERSION,
  MAC_DOWNLOAD_URL,
  readLatestReleaseManifest,
  toMacDmgUrl,
} from "../../lib/downloads";

export const metadata: Metadata = {
  title: "Downloads for macOS",
  description: "Direct macOS download page for StageFlo installer recovery and manual installs.",
  alternates: {
    canonical: "/downloads/mac/",
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
          <p className="eyebrow">Direct macOS Download</p>
          <h1>Manual macOS Installer Access</h1>
          <p className="lead">
            This page stays public for updater fallback and recovery installs. It does not use the lead-capture form.
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