import type { Metadata } from "next";
import Link from "next/link";
import TopNav from "../components/topNav";
import { GUIDE_GROUPS, guides } from "./guides";
import styles from "./guides.module.css";

export const metadata: Metadata = {
  title: "StageFlo Guides | Step by step",
  description:
    "Step-by-step guides for StageFlo, with a picture of every step: screens, looks, service plans, the team's phones, livestreaming and your library.",
  alternates: { canonical: "/guides/" },
  openGraph: {
    title: "StageFlo Guides | Step by step",
    description: "Step-by-step guides for StageFlo, with a picture of every step.",
    url: "/guides/",
    type: "website",
  },
};

export default function GuidesPage() {
  return (
    <div className="site-shell">
      <TopNav
        brandLabel="StageFlo Guides"
      />
      <main className={styles.main}>
        <header className={styles.header}>
          <span className={styles.where}>StageFlo · Guides</span>
          <h1 className={styles.title}>Step by step</h1>
          <p className={styles.lede}>
            Short guides for the things a church does every week, each with a picture of every step
            from StageFlo. For every setting in detail, see the <Link href="/docs/introduction/">docs</Link>.
          </p>
        </header>

        {GUIDE_GROUPS.map((group) => (
          <section key={group} className={styles.group}>
            <h2>{group}</h2>
            <div className={styles.cards}>
              {guides
                .filter((guide) => guide.group === group)
                .map((guide) => {
                  return (
                    <Link key={guide.slug} href={`/guides/${guide.slug}/`} className={styles.card}>
                      {/* A small picture from one of the guide's steps. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/guides/${guide.slug}/${guide.cover}.png`} alt="" loading="lazy" />
                      <div>
                        <h3>{guide.title}</h3>
                        <p>{guide.summary}</p>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
