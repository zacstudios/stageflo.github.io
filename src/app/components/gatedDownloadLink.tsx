"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const CURRENT_VERSION = "2.0.0";
const MAC_DOWNLOAD_URL = `https://github.com/zacstudios/stageflo.github.io/releases/download/v${CURRENT_VERSION}/stageflo-${CURRENT_VERSION}.dmg`;
const WINDOWS_DOWNLOAD_URL = `https://github.com/zacstudios/stageflo.github.io/releases/download/v${CURRENT_VERSION}/stageflo-${CURRENT_VERSION}-setup.exe`;

type GatedDownloadLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  formTitle?: string;
  source: "desktop" | "resource";
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const ENDPOINT_URL =
  process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL?.trim() ||
  process.env.NEXT_PUBLIC_DOWNLOAD_LEAD_ENDPOINT?.trim() ||
  "";

export default function GatedDownloadLink({
  href,
  children,
  className,
  formTitle = "Get your download",
  source,
}: GatedDownloadLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const hiddenLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const endpointAvailable = useMemo(() => Boolean(ENDPOINT_URL), []);

  const resetAndClose = () => {
    setIsOpen(false);
    setSubmitState("idle");
    setErrorMessage("");
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!ENDPOINT_URL) {
      setSubmitState("error");
      setErrorMessage("Download form is not configured yet. Please try again shortly.");
      return;
    }

    if (company.trim()) {
      setSubmitState("error");
      setErrorMessage("We could not submit your details right now. Please try again.");
      return;
    }

    setSubmitState("submitting");
    setErrorMessage("");

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      marketingOptIn,
      consent,
      source,
      downloadUrl: href,
      page: typeof window !== "undefined" ? window.location.href : "",
      submittedAt: new Date().toISOString(),
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
    };

    try {
      const response = await fetch(ENDPOINT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Submission failed with status ${response.status}`);
      }

      setSubmitState("success");
      // Trigger download via hidden anchor to avoid popup blocker (window.open after async is blocked)
      if (hiddenLinkRef.current) {
        hiddenLinkRef.current.click();
      }
    } catch {
      setSubmitState("error");
      setErrorMessage("We could not submit your details right now. Please try again.");
    }
  };

  return (
    <>
      {/* Hidden anchor used to trigger download after async form submission (avoids popup blocker) */}
      <a ref={hiddenLinkRef} href={href} download aria-hidden="true" tabIndex={-1} style={{ display: "none" }} />
      <a
        href={href}
        className={className ?? "download-gate-inline-link"}
        aria-haspopup="dialog"
        onClick={(event) => {
          event.preventDefault();
          setIsOpen(true);
        }}
      >
        {children}
      </a>

      {isOpen && isMounted
        ? createPortal(
        <div className="download-gate-overlay" role="presentation" onClick={resetAndClose}>
          <section
            className="download-gate-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="download-gate-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="download-gate-title">{formTitle}</h3>
            <button
              type="button"
              className="download-gate-close"
              aria-label="Close download form"
              onClick={resetAndClose}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <p>
              Share your name and email to continue. We will use this to send download updates and important fixes.
            </p>
            <p className="download-gate-helper">We respect your privacy. You can unsubscribe from emails anytime.</p>

            {!endpointAvailable ? (
              <p className="download-gate-error">
                Form endpoint is missing. Set NEXT_PUBLIC_SUPABASE_FUNCTION_URL in your site environment.
              </p>
            ) : null}

            <form className="download-gate-form" onSubmit={onSubmit}>
              <label htmlFor="download-name">Name</label>
              <input
                id="download-name"
                name="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                autoComplete="name"
                minLength={2}
                maxLength={80}
                disabled={submitState === "submitting"}
              />

              <label htmlFor="download-email">Email</label>
              <input
                id="download-email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                maxLength={120}
                disabled={submitState === "submitting"}
              />

              <input
                type="text"
                name="company"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
              />

              <label className="download-gate-checkbox">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  required
                  disabled={submitState === "submitting"}
                />
                <span>
                  I agree that StageFlo can store this information for download delivery and product updates, as described in
                  <a href="/privacy/" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>.
                </span>
              </label>

              <label className="download-gate-checkbox">
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={(event) => setMarketingOptIn(event.target.checked)}
                  disabled={submitState === "submitting"}
                />
                <span>I want occasional feature and release emails.</span>
              </label>

              {submitState === "error" ? <p className="download-gate-error">{errorMessage}</p> : null}
              {submitState === "success" ? (
                <div className="download-gate-success">
                  <p style={{ marginBottom: "12px" }}>Done! Click your platform to download:</p>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <a href={MAC_DOWNLOAD_URL} download style={{ display: "inline-block", padding: "10px 18px", borderRadius: "999px", background: "#7c3aed", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>Download for Mac</a>
                    <a href={WINDOWS_DOWNLOAD_URL} download style={{ display: "inline-block", padding: "10px 18px", borderRadius: "999px", background: "#1e3a5f", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>Download for Windows</a>
                  </div>
                </div>
              ) : null}

              <div className="download-gate-actions">
                <button type="button" className="button button-secondary" onClick={resetAndClose} disabled={submitState === "submitting"}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button button-primary download-gate-submit"
                  disabled={submitState === "submitting" || !endpointAvailable}
                >
                  <span className="download-gate-submit-copy">
                    {submitState === "submitting"
                      ? "Submitting..."
                      : submitState === "success"
                        ? "Download Ready"
                        : "Continue to Download"}
                  </span>
                  <span className="download-gate-submit-arrow" aria-hidden="true">
                    {submitState === "submitting" ? "..." : submitState === "success" ? "✓" : "→"}
                  </span>
                </button>
              </div>
            </form>
          </section>
        </div>
          , document.body)
        : null}
    </>
  );
}