"use client";

import Link from "next/link";
import { useState } from "react";
import { guideBySlug } from "../../guides/guides";
import styles from "./page.module.css";
import { sectionVisuals } from "./sectionVisuals";
import VisualGuide from "./visualGuide";

/** The step-by-step guides for each docs topic, shown under its heading. */
const sectionGuides: Record<string, string[]> = {
  "core-workflow": ["set-up-screens", "sunday-template", "run-service"],
  "set-up-screens": ["set-up-screens", "livestream-look", "stage-layout", "standby"],
  "plan-workflow": ["sections", "sunday-template", "run-service", "share-plan"],
  "service-plans": ["sections", "sunday-template", "run-service", "share-plan"],
  "songs-key-bpm": ["music-director"],
  "bible-browser": ["bible"],
  "library-backups": ["share-plan"],
  "settings-remote": ["team-phones"],
  "music-director": ["music-director"],
  "remote-stage-view-over-internet": ["team-phones"],
  "settings-display": ["livestream-look"],
  "settings-stage": ["stage-layout"],
  timers: ["timers"],
  "stage-message": ["timers"],
  "settings-lowerthird": ["lower-third"],
  "settings-screens": ["set-up-screens", "standby", "livestream-look"],
  "settings-songs": ["songs"],
  "song-editing": ["songs"],
  outputs: ["set-up-screens", "stage-layout"],
  "first-service": ["set-up-screens", "sections", "team-phones", "run-service"],
};

type SectionHeadingProps = {
  sectionId: string;
  title: string;
};

export default function SectionHeading({ sectionId, title }: SectionHeadingProps) {
  const [copied, setCopied] = useState(false);
  const visual = sectionVisuals[sectionId];
  const related = (sectionGuides[sectionId] ?? [])
    .map((slug) => guideBySlug(slug))
    .filter((guide) => guide !== undefined);

  const handleCopy = async () => {
    if (typeof window === "undefined") return;

    const link = `${window.location.origin}/docs/introduction/#${sectionId}`;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <div className={styles.sectionHeading}>
        <h2>{title}</h2>
        <button
          type="button"
          className={styles.copyLinkButton}
          onClick={handleCopy}
          aria-label={`Copy link to ${title}`}
        >
          {copied ? "Copied" : "Copy Link"}
        </button>
      </div>
      {related.length > 0 ? (
        <p className={styles.guideLinks}>
          <span>Step by step:</span>
          {related.map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}/`}>
              {guide.title} →
            </Link>
          ))}
        </p>
      ) : null}
      {visual ? <VisualGuide {...visual} /> : null}
    </>
  );
}
