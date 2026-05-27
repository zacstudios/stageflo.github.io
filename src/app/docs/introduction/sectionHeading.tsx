"use client";

import { useState } from "react";
import styles from "./page.module.css";

type SectionHeadingProps = {
  sectionId: string;
  title: string;
};

export default function SectionHeading({ sectionId, title }: SectionHeadingProps) {
  const [copied, setCopied] = useState(false);

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
  );
}
