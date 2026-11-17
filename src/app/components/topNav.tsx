"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

/**
 * The site menu, the same on every page so a link never moves or disappears between pages.
 * Download is a button of its own, always in view (also next to ☰ on a phone).
 */
const SITE_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Guides", href: "/guides/" },
  { label: "Docs", href: "/docs/introduction/" },
  { label: "Supporters", href: "/supporters/" },
  { label: "Feedback", href: "/feedback/" },
] as const;

const DOWNLOAD_HREF = "/downloads/";

type TopNavProps = {
  /** The name beside the logo, such as "StageFlo Docs" in the docs. */
  brandLabel: string;
  brandHref?: string;
};

/** "/guides/sections/" → "/guides/sections", so pages match with or without the slash. */
function normalise(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

export default function TopNav({ brandLabel, brandHref = "/" }: TopNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = normalise(usePathname() ?? "/");

  const closeMenu = () => setIsOpen(false);
  // The page you're on, or a page under it (a guide is under Guides).
  const isCurrent = (href: string) => {
    if (href.includes("#")) return false;
    const target = normalise(href);
    // Docs covers every docs page, not only the introduction.
    const section = target.startsWith("/docs") ? "/docs" : target;
    return pathname === section || pathname.startsWith(`${section}/`);
  };
  const downloadCurrent = isCurrent(DOWNLOAD_HREF);

  return (
    <header className="top-nav">
      <Link className="brand" href={brandHref} aria-label="StageFlo home" onClick={closeMenu}>
        <Image
          src="/stageflo-icon.png"
          alt="StageFlo"
          width={30}
          height={30}
          style={{
            borderRadius: "0.55rem",
            background: "rgba(124, 58, 237, 0.35)",
            boxShadow: "0 0 0 1.5px rgba(196, 181, 253, 0.5), 0 2px 10px rgba(124, 58, 237, 0.4)",
          }}
        />
        {/* "StageFlo Docs": the section's name hides on small phones, where the menu shows it. */}
        <span>
          {brandLabel.startsWith("StageFlo ") ? (
            <>
              StageFlo<span className="brand-suffix"> {brandLabel.slice("StageFlo ".length)}</span>
            </>
          ) : (
            brandLabel
          )}
        </span>
      </Link>

      <nav
        id="top-nav-links"
        aria-label="Site"
        className={isOpen ? "top-nav-links is-open" : "top-nav-links"}
      >
        {SITE_LINKS.map((item) => {
          const current = isCurrent(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              aria-current={current ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        className="nav-download"
        href={DOWNLOAD_HREF}
        onClick={closeMenu}
        aria-current={downloadCurrent ? "page" : undefined}
      >
        Download
      </Link>

      <button
        type="button"
        className="mobile-nav-toggle"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="top-nav-links"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span aria-hidden="true" className="mobile-nav-toggle-icon">
          {isOpen ? "✕" : "☰"}
        </span>
      </button>
    </header>
  );
}
