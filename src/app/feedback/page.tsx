import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FeedbackForm from "../components/feedbackForm";

export const metadata: Metadata = {
  title: "StageFlo Feedback and Bug Reports",
  description:
    "Report StageFlo bugs, request features, and share feedback with the StageFlo team at Zac Studios.",
  alternates: {
    canonical: "/feedback/",
  },
  openGraph: {
    title: "StageFlo Feedback and Bug Reports",
    description:
      "Report StageFlo bugs, request features, and share feedback with the StageFlo team at Zac Studios.",
    url: "/feedback/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StageFlo Feedback and Bug Reports",
    description:
      "Report StageFlo bugs, request features, and share feedback with the StageFlo team at Zac Studios.",
  },
};

export default function Feedback() {
  return (
    <div className="site-shell feedback-page">
      <header className="top-nav">
        <Link className="brand" href="/" aria-label="StageFlo home">
          <Image src="/stageflo-icon.png" alt="StageFlo" width={30} height={30} />
          <span>StageFlo</span>
        </Link>
        <nav>
          <Link href="/#features">Features</Link>
          <Link href="/#screenshots">Screenshots</Link>
          <Link href="/#install">Install</Link>
          <Link href="/">Home</Link>
        </nav>
      </header>

      <main className="feedback-main">
        <section className="hero feedback-hero" id="feedback">
          <span className="eyebrow">StageFlo Feedback</span>
          <h1>Feedback & Bug Reports</h1>
          <p className="lead">
            Help us improve StageFlo by reporting bugs, suggesting features, or sharing your experience without needing a GitHub login.
          </p>
        </section>

        <FeedbackForm />

        <section className="install feedback-resources">
          <div className="install-grid feedback-resources-grid">
            <article className="install-card reveal">
              <h3>View Known Issues</h3>
              <p style={{ color: "var(--muted)", lineHeight: "1.55" }}>
                Check the issue tracker to see what&apos;s being worked on and what other users have reported.
              </p>
              <a
                href="https://github.com/zacstudios/Stageflo.app/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="feedback-link"
              >
                View Issues →
              </a>
            </article>

            <article className="install-card reveal">
              <h3>Join Discussions</h3>
              <p style={{ color: "var(--muted)", lineHeight: "1.55" }}>
                Connect with the StageFlo team and users, ask questions, and share ideas in the project repository.
              </p>
              <a
                href="https://github.com/zacstudios/Stageflo.app"
                target="_blank"
                rel="noopener noreferrer"
                className="feedback-link"
              >
                Visit Repository →
              </a>
            </article>
          </div>
        </section>

        <section className="community feedback-guidelines">
          <div className="section-head">
            <h2>Guidelines for Feedback</h2>
            <p>To help us address your feedback effectively:</p>
          </div>
          <ul className="feedback-guidelines-list">
            <li><strong>Be specific:</strong> Include details about your OS, StageFlo version, and steps to reproduce.</li>
            <li><strong>One issue per report:</strong> Keep each submission focused and clear.</li>
            <li><strong>Include impact:</strong> Tell us how this affects your service workflow.</li>
            <li><strong>Attach logs or screenshots:</strong> Visual context helps us understand and fix problems faster.</li>
            <li><strong>Be constructive:</strong> Help us improve by explaining the impact and use case.</li>
          </ul>
        </section>

        <section className="feedback-thanks">
          <p>
            Thank you for helping make StageFlo better for worship teams everywhere.
          </p>
          <div className="cta-row feedback-thanks-actions">
            <Link href="/" className="button button-secondary">
              Back to Home
            </Link>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-company">
          <Image
            src="/brand/zac-studios-logo.png"
            alt="Zac Studios"
            width={150}
            height={46}
            className="company-logo"
          />
          <p>StageFlo by Zac Studios.</p>
        </div>
        <small>
          <a href="https://github.com/zacstudios/Stageflo.app" target="_blank" rel="noopener noreferrer">GitHub</a>
          {" · "}
          <a href="mailto:zac@stageflo.app">zac@stageflo.app</a>
        </small>
      </footer>
    </div>
  );
}
