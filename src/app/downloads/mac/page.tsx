import type { Metadata } from "next";
import Link from "next/link";
import {
  CURRENT_VERSION,
  MAC_ARM64_DOWNLOAD_URL,
  MAC_X64_DOWNLOAD_URL,
  readLatestMacReleaseManifest,
  toMacDmgUrl,
} from "../../lib/downloads";

export const metadata: Metadata = {
  title: "Download StageFlo for macOS",
  description:
    "Download StageFlo for macOS, free multilingual worship presentation software for church presentation computers.",
  alternates: {
    canonical: "/downloads/mac/",
  },
  openGraph: {
    title: "Download StageFlo for macOS",
    description:
      "Free multilingual worship presentation software for church presentation computers.",
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
      "Free multilingual worship presentation software for church presentation computers.",
    images: ["/og-image.png"],
  },
};

export default async function MacDownloadsPage() {
  const macManifest = await readLatestMacReleaseManifest();
  const latestMac = macManifest ?? {
    version: CURRENT_VERSION,
    arm64Url: MAC_ARM64_DOWNLOAD_URL,
    x64Url: MAC_X64_DOWNLOAD_URL,
  };
  const latestMacArm64DownloadUrl = toMacDmgUrl(latestMac.arm64Url, latestMac.version, "arm64");
  const latestMacX64DownloadUrl = toMacDmgUrl(latestMac.x64Url, latestMac.version, "x64");

  return (
    <div className="site-shell">
      <main className="page-main">
        <section className="hero downloads-hero downloads-direct-hero">
          <p className="eyebrow">macOS Download</p>
          <h1>Download StageFlo for Mac</h1>
          <p className="lead">
            Install StageFlo on macOS for worship lyrics, Bible verse projection, media,
            stage display, OBS lower-thirds, and remote control during multilingual church services.
            Pick the build that matches your Mac&apos;s chip.
          </p>
          <div className="cta-row">
            <a className="button button-primary" href={latestMacArm64DownloadUrl}>
              Apple Silicon (M1–M4) v{latestMac.version}
            </a>
            <a className="button button-secondary" href={latestMacX64DownloadUrl}>
              Intel Mac v{latestMac.version}
            </a>
          </div>
          <p className="cta-mac-arch-note">
            Not sure which chip you have? Click the Apple menu &rarr; About This Mac. If it says
            &ldquo;Chip: Apple M1/M2/M3/M4&rdquo;, use Apple Silicon. If it says &ldquo;Processor:
            Intel&rdquo;, use the Intel build.
          </p>
          <div className="cta-row">
            <Link className="button button-secondary" href="/downloads/">
              Back to Downloads Hub
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
