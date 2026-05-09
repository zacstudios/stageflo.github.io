import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "StageFlo Feedback and Bug Reports",
  description:
    "Report StageFlo bugs, request features, and share feedback with the StageFlo team at Zac Studios Ltd.",
  alternates: {
    canonical: "/feedback/",
  },
  openGraph: {
    title: "StageFlo Feedback and Bug Reports",
    description:
      "Report StageFlo bugs, request features, and share feedback with the StageFlo team at Zac Studios Ltd.",
    url: "/feedback/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StageFlo Feedback and Bug Reports",
    description:
      "Report StageFlo bugs, request features, and share feedback with the StageFlo team at Zac Studios Ltd.",
  },
};

export default function Feedback() {
  return (
    <div className="site-shell">
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

      <main>
        <section className="hero" id="feedback">
          <h1>Feedback & Bug Reports</h1>
          <p className="lead">
            Help us improve StageFlo by reporting bugs, suggesting features, or sharing your experience.
          </p>
        </section>

        <section className="install" style={{ marginTop: "2.5rem" }}>
          <div className="install-grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <article className="install-card reveal">
              <h3>Report a Bug</h3>
              <p style={{ color: "var(--muted)", lineHeight: "1.55" }}>
                Found an issue or unexpected behavior? Open a bug report on GitHub with details about what went wrong.
              </p>
              <a
                href="https://github.com/zacstudios/Stageflo.app/issues/new?template=bug_report.md&title=Bug%3A+"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "0.9rem",
                  color: "var(--accent-strong)",
                }}
              >
                Report Bug →
              </a>
            </article>

            <article className="install-card reveal">
              <h3>Suggest a Feature</h3>
              <p style={{ color: "var(--muted)", lineHeight: "1.55" }}>
                Have an idea to make StageFlo better? Share feature requests and enhancements on GitHub.
              </p>
              <a
                href="https://github.com/zacstudios/Stageflo.app/issues/new?template=feature_request.md&title=Feature%3A+"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "0.9rem",
                  color: "var(--accent-strong)",
                }}
              >
                Suggest Feature →
              </a>
            </article>

            <article className="install-card reveal">
              <h3>View Known Issues</h3>
              <p style={{ color: "var(--muted)", lineHeight: "1.55" }}>
                Check the issue tracker to see what&apos;s being worked on and what other users have reported.
              </p>
              <a
                href="https://github.com/zacstudios/Stageflo.app/issues"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "0.9rem",
                  color: "var(--accent-strong)",
                }}
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
                style={{
                  display: "inline-block",
                  marginTop: "0.9rem",
                  color: "var(--accent-strong)",
                }}
              >
                Visit Repository →
              </a>
            </article>
          </div>
        </section>

        <section className="community" style={{ marginTop: "3.5rem" }}>
          <div className="section-head">
            <h2>Guidelines for Feedback</h2>
            <p>To help us address your feedback effectively:</p>
          </div>
          <ul style={{ color: "var(--muted)", lineHeight: "1.8", paddingLeft: "1.5rem" }}>
            <li><strong>Be specific:</strong> Include details about your OS, StageFlo version, and steps to reproduce.</li>
            <li><strong>One issue per report:</strong> Keep bug reports and feature requests focused and clear.</li>
            <li><strong>Check existing issues:</strong> Your report may already be logged—search before submitting.</li>
            <li><strong>Attach logs or screenshots:</strong> Visual context helps us understand and fix problems faster.</li>
            <li><strong>Be constructive:</strong> Help us improve by explaining the impact and use case.</li>
          </ul>
        </section>

        <section style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid var(--line)" }}>
          <p style={{ color: "var(--muted)", textAlign: "center" }}>
            Thank you for helping make StageFlo better for worship teams everywhere.
          </p>
          <div className="cta-row" style={{ justifyContent: "center", marginTop: "1.5rem" }}>
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
            alt="Zac Studios Ltd"
            width={150}
            height={46}
            className="company-logo"
          />
          <p>StageFlo by Zac Studios Ltd.</p>
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
