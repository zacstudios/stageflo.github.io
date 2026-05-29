"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type TopNavLink = {
  label: string;
  href: string;
  external?: boolean;
};

type TopNavProps = {
  brandLabel: string;
  brandHref?: string;
  links: TopNavLink[];
};

export default function TopNav({ brandLabel, brandHref = "/", links }: TopNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

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
        <span>{brandLabel}</span>
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

      <nav id="top-nav-links" className={isOpen ? "top-nav-links is-open" : "top-nav-links"}>
        {links.map((item) => {
          if (item.external) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            );
          }

          if (item.href.startsWith("/")) {
            return (
              <Link key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </Link>
            );
          }

          return (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
