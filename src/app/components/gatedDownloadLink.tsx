"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type GatedDownloadLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  formTitle?: string;
  source: "desktop" | "resource";
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const DEFAULT_FORMSPREE_ENDPOINT = "https://formspree.io/f/xpqovjbo";
const ENDPOINT_URL = process.env.NEXT_PUBLIC_DOWNLOAD_LEAD_ENDPOINT?.trim() || DEFAULT_FORMSPREE_ENDPOINT;

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
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
      window.open(href, "_blank", "noopener,noreferrer");

      window.setTimeout(() => {
        resetAndClose();
      }, 900);
    } catch {
      setSubmitState("error");
      setErrorMessage("We could not submit your details right now. Please try again.");
    }
  };

  return (
    <>
      <a
        href={href}
        className={className}
        onClick={(event) => {
          event.preventDefault();
          setIsOpen(true);
        }}
      >
        {children}
      </a>

      {isOpen ? (
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
                Form endpoint is missing. Set NEXT_PUBLIC_DOWNLOAD_LEAD_ENDPOINT in your site environment.
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
              {submitState === "success" ? <p className="download-gate-success">Success. Your download is starting.</p> : null}

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
      ) : null}
    </>
  );
}