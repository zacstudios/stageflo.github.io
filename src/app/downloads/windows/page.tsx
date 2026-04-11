import type { Metadata } from "next";
import Link from "next/link";
import {
  CURRENT_VERSION,
  WINDOWS_DOWNLOAD_URL,
  readLatestReleaseManifest,
} from "../../lib/downloads";

export const metadata: Metadata = {
  title: "Downloads for Windows",
  description: "Direct Windows download page for StageFlo installer recovery and manual installs.",
  alternates: {
    canonical: "/downloads/windows/",
  },
};

export default async function WindowsDownloadsPage() {
  const windowsManifest = await readLatestReleaseManifest("latest.yml");
  const latestWindows = windowsManifest ?? { version: CURRENT_VERSION, url: WINDOWS_DOWNLOAD_URL };

  return (
    <div className="site-shell">
      <main className="page-main">
        <section className="hero downloads-hero downloads-direct-hero">
          <p className="eyebrow">Direct Windows Download</p>
          <h1>Manual Windows Installer Access</h1>
          <p className="lead">
            This page stays public for updater fallback and recovery installs. It does not use the lead-capture form.
          </p>
          <div className="cta-row">
            <a className="button button-primary" href={latestWindows.url}>
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