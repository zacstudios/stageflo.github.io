import type { Metadata } from "next";
import TopNav from "../components/topNav";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How StageFlo collects and uses personal data for downloads.",
  alternates: {
    canonical: "/privacy/",
  },
  openGraph: {
    title: "Privacy Policy | StageFlo",
    description: "How StageFlo collects and uses personal data for downloads.",
    url: "/privacy/",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StageFlo Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | StageFlo",
    description: "How StageFlo collects and uses personal data for downloads.",
    images: ["/og-image.png"],
  },
};

export default function PrivacyPage() {
  return (
    <div className="site-shell page-main" style={{ gap: "1rem" }}>
      <TopNav
        brandLabel="StageFlo"
        links={[
          { label: "Home", href: "/" },
          { label: "Downloads", href: "/downloads/" },
          { label: "Docs", href: "/docs/introduction/" },
          { label: "Feedback", href: "/feedback/" },
        ]}
      />

      <main>
        <section className="section-block" style={{ marginTop: 0 }}>
          <div className="section-head">
            <h1>Privacy Policy</h1>
            <p>Effective date: April 11, 2026</p>
          </div>
        </section>

        <section className="card" style={{ padding: "1.35rem" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>Information We Collect</h2>
          <p>When you request a download on stageflo.app, we collect your name and email address.</p>
        </section>

        <section className="card" style={{ padding: "1.35rem" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>How We Use It</h2>
          <p>We use this information to deliver requested downloads, notify you about critical product updates, and provide release information.</p>
          <p>If you opt in, we may also send occasional feature announcements.</p>
        </section>

        <section className="card" style={{ padding: "1.35rem" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>Retention</h2>
          <p>We keep lead records only as long as needed for download support and legitimate product communication.</p>
        </section>

        <section className="card" style={{ padding: "1.35rem" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>Your Choices</h2>
          <p>You can request data correction or deletion at any time by contacting zac@stageflo.app.</p>
        </section>

        <section className="card" style={{ padding: "1.35rem" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>Contact</h2>
          <p>Email: <a href="mailto:zac@stageflo.app">zac@stageflo.app</a></p>
        </section>
      </main>
    </div>
  );
}
