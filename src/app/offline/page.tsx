import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "App Offline",
  description:
    "Fallback page shown when a StageFlo public tunnel is unavailable.",
  alternates: {
    canonical: "/offline/",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return (
    <main className="offline-page">
      <div className="offline-shell">
        <p className="offline-eyebrow">Public Link Unavailable</p>
        <h1>This StageFlo app is currently offline.</h1>
        <p className="offline-lead">
          The operator&apos;s computer is not connected to its public StageFlo tunnel right now.
          Ask them to reopen StageFlo or restart the public link, then try again.
        </p>
        <p className="offline-website-note">
          If you just want the main StageFlo website, use the button below.
        </p>

        <div className="offline-actions">
          <Link href="/" className="button button-primary">
            Visit Main Website
          </Link>
          <a className="button button-secondary" href="javascript:window.location.reload()">
            Try Again
          </a>
        </div>

        <div className="offline-card">
          <p className="offline-card-title">What this usually means</p>
          <ul className="offline-list">
            <li>The StageFlo desktop app was closed.</li>
            <li>The internet connection dropped at the venue.</li>
            <li>The public tunnel was stopped or is reconnecting.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}