import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TopNav from "../../components/topNav";
import { guideBySlug, guides } from "../guides";
import images from "../images.json";
import RichText from "../richText";
import styles from "../guides.module.css";

// Only the guides listed in guides.ts exist; others are a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) return {};
  const title = `${guide.title} | StageFlo Guides`;
  return {
    title,
    description: guide.summary,
    alternates: { canonical: `/guides/${guide.slug}/` },
    openGraph: { title, description: guide.summary, url: `/guides/${guide.slug}/`, type: "article" },
  };
}

const sizes = images as Record<string, { width: number; height: number }>;

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) notFound();
  const index = guides.indexOf(guide);
  const previous = guides[index - 1];
  const next = guides[index + 1];

  return (
    <div className="site-shell">
      <TopNav
        brandLabel="StageFlo Guides"
      />
      <main className={styles.main}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/guides/">Guides</Link> · {guide.group}
        </nav>

        <header className={styles.header}>
          <span className={styles.where}>{guide.where}</span>
          <h1 className={styles.title}>{guide.title}</h1>
          <p className={styles.lede}>
            <RichText text={guide.lede} />
          </p>
        </header>

        {guide.before ? (
          <section className={styles.before}>
            <h2>{guide.before.title}</h2>
            <ul>
              {guide.before.items.map((item) => (
                <li key={item}>
                  <RichText text={item} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <ol className={styles.steps}>
          {guide.steps.map((step) => {
            const size = sizes[`${guide.slug}/${step.image}`] ?? { width: 1200, height: 800 };
            return (
              <li key={step.image} className={styles.step}>
                <div className={styles.stepHead}>
                  <h3>{step.title}</h3>
                </div>
                <p className={styles.text}>
                  <RichText text={step.text} />
                </p>
                <figure className={styles.figure}>
                  <Image
                    src={`/guides/${guide.slug}/${step.image}.png`}
                    alt={step.alt}
                    width={size.width}
                    height={size.height}
                    style={{ width: Math.min(size.width / 2, 736), height: "auto" }}
                    loading="lazy"
                  />
                </figure>
                {step.tip ? (
                  <div className={styles.tip}>
                    <RichText text={step.tip} />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>

        {guide.footer ? (
          <p className={styles.footer}>
            <RichText text={guide.footer} /> The pictures use example content.
          </p>
        ) : (
          <p className={styles.footer}>The pictures use example content.</p>
        )}

        <nav className={styles.next} aria-label="More guides">
          {previous ? <Link href={`/guides/${previous.slug}/`}>← {previous.title}</Link> : <span />}
          {next ? <Link href={`/guides/${next.slug}/`}>{next.title} →</Link> : <Link href="/guides/">All guides →</Link>}
        </nav>
      </main>
    </div>
  );
}
