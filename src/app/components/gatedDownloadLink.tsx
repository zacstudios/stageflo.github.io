"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type GatedDownloadLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  formTitle?: string;
  source: "desktop" | "resource";
};

type SubmitState = "idle" | "submitting" | "success" | "error";

function getEndpointUrl() {
  const explicit = process.env.NEXT_PUBLIC_DOWNLOAD_LEAD_ENDPOINT?.trim() ?? "";
  if (explicit) return explicit;

  const base = process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL?.trim() ?? "";
  if (!base) return "";

  if (base.endsWith("/capture-download-lead")) {
    return base;
  }

  if (base.endsWith("/capture-download-lead/")) {
    return base.slice(0, -1);
  }

  if (base.includes(".functions.supabase.co")) {
    return `${base.replace(/\/+$/, "")}/capture-download-lead`;
  }

  return base;
}

const ENDPOINT_URL = getEndpointUrl();
const INSTALLATION_TROUBLESHOOTING_URL = "/docs/introduction/#installation-troubleshooting";

async function wait(ms: number) {
  await new Promise((resolve) => window.setTimeout(resolve, ms));
}

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
      let response: Response | null = null;
      let lastError: unknown = null;

      for (let attempt = 0; attempt < 2; attempt += 1) {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 12000);

        try {
          response = await fetch(ENDPOINT_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });
        } catch (error) {
          lastError = error;
        } finally {
          window.clearTimeout(timeout);
        }

        const shouldRetry = !response || response.status >= 500 || response.status === 429;
        if (!shouldRetry) break;

        if (attempt < 1) {
          await wait(500);
        }
      }

      if (!response) {
        throw lastError instanceof Error ? lastError : new Error("Network request failed");
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message = typeof (data as { error?: unknown }).error === "string"
          ? (data as { error: string }).error
          : "Submission failed";
        throw new Error(`${message} (status ${response.status})`);
      }

      setSubmitState("success");
      window.open(href, "_blank", "noopener,noreferrer");
    } catch {
      setSubmitState("error");
      setErrorMessage("We could not submit your details right now. Please try again, or continue to download.");
    }
  };

  return (
    <>
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

            {submitState === "success" ? (
              <div className="download-confirmation">
                <div className="download-confirmation-status" role="status" aria-live="polite">
                  <span className="download-confirmation-check" aria-hidden="true">✓</span>
                  <div>
                    <p className="download-confirmation-kicker">Download ready</p>
                    <p>Your download is starting in a new tab. Keep this handy if your computer asks for permission.</p>
                  </div>
                </div>
                <div className="download-confirmation-panel">
                  <div className="download-confirmation-panel-header">
                    <div>
                      <p className="download-confirmation-kicker">Install notes</p>
                      <h4>Quick permission steps</h4>
                    </div>
                    <a href={INSTALLATION_TROUBLESHOOTING_URL}>Full guide</a>
                  </div>
                  <div className="download-confirmation-steps">
                    <section className="download-confirmation-card" aria-label="macOS installation help">
                      <span aria-hidden="true">Mac</span>
                      <p>Move StageFlo to Applications, open it once, then allow it in Privacy &amp; Security.</p>
                    </section>
                    <section className="download-confirmation-card" aria-label="Windows installation help">
                      <span aria-hidden="true">Windows</span>
                      <p>If SmartScreen appears, choose More info, then Run anyway.</p>
                    </section>
                  </div>
                </div>
                <div className="download-gate-actions download-confirmation-actions">
                  <button type="button" className="button button-secondary" onClick={resetAndClose}>
                    Close
                  </button>
                  <button
                    type="button"
                    className="button button-primary download-gate-submit"
                    onClick={() => {
                      window.open(href, "_blank", "noopener,noreferrer");
                    }}
                  >
                    Download Again
                  </button>
                </div>
              </div>
            ) : (
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

                <div className="download-gate-actions">
                  <button type="button" className="button button-secondary" onClick={resetAndClose} disabled={submitState === "submitting"}>
                    Cancel
                  </button>
                  {submitState === "error" ? (
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => {
                        window.open(href, "_blank", "noopener,noreferrer");
                        resetAndClose();
                      }}
                    >
                      Download Anyway
                    </button>
                  ) : null}
                  <button
                    type="submit"
                    className="button button-primary download-gate-submit"
                    disabled={submitState === "submitting" || !endpointAvailable}
                  >
                    <span className="download-gate-submit-copy">
                      {submitState === "submitting" ? "Submitting..." : "Continue to Download"}
                    </span>
                    <span className="download-gate-submit-arrow" aria-hidden="true">
                      {submitState === "submitting" ? "..." : "→"}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
          , document.body)
        : null}
    </>
  );
}
