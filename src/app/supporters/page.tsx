import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import StripePricingTable from "../components/stripePricingTable";

const ONE_TIME_SUPPORT_URL = "https://buy.stripe.com/5kQ14n1NM56kf7F8PC0Fi02";

export const metadata: Metadata = {
  title: "StageFlo Supporters",
  description:
    "Support StageFlo by Zac Studios Ltd through recurring or one-time contributions and help fund new releases.",
  alternates: {
    canonical: "/supporters/",
  },
  openGraph: {
    title: "StageFlo Supporters",
    description:
      "Support StageFlo by Zac Studios Ltd through recurring or one-time contributions.",
    url: "/supporters/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StageFlo Supporters",
    description:
      "Support StageFlo by Zac Studios Ltd through recurring or one-time contributions.",
  },
};

export default function SupportersPage() {
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
          <Link href="/docs/introduction/">Docs</Link>
          <Link href="/feedback/">Feedback</Link>
          <Link href="/">Home</Link>
        </nav>
      </header>

      <main className="page-main">
        <section className="hero" id="supporters">
          <div className="hero-badges">
            <p className="eyebrow">Support StageFlo</p>
          </div>
          <h1>Help us build StageFlo for churches worldwide.</h1>
          <p className="lead">
            StageFlo is developed by Zac Studios Ltd. Your support helps us deliver faster updates,
            better reliability, and long-term product support for worship teams.
          </p>
        </section>

        <section className="install section-block">
          <div className="section-head" style={{ marginBottom: "1.4rem" }}>
            <h2>Contribute</h2>
            <p>Choose a recurring or one-time option in the secure Stripe pricing table below.</p>
          </div>
          <div className="install-card reveal">
            <StripePricingTable />
            <p style={{ color: "var(--muted)", marginTop: "1rem" }}>
              Prefer direct one-time checkout?{" "}
              <a
                href={ONE_TIME_SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent-light)" }}
              >
                Use one-time support link
              </a>
              .
            </p>
          </div>
        </section>

        <section className="section-block" style={{ marginTop: "2.2rem" }}>
          <p style={{ color: "var(--muted)", textAlign: "center" }}>
            Thank you for supporting StageFlo by Zac Studios Ltd.
          </p>
          <div className="cta-row" style={{ justifyContent: "center" }}>
            <Link className="button button-secondary" href="/">
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
          <Link href="/feedback/">Feedback</Link>
          {" · "}
          <Link href="/docs/introduction/">Docs</Link>
          {" · "}
          <a href="https://github.com/zacstudios/Stageflo.app" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          {" · "}
          <a href="mailto:zac@stageflo.app">zac@stageflo.app</a>
        </small>
      </footer>
    </div>
  );
}
