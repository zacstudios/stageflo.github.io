"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type FeedbackType = "bug" | "feature" | "general";
type SubmitState = "idle" | "submitting" | "success" | "error";

function normalizeType(value: string): FeedbackType {
  if (value === "bug" || value === "feature") return value;
  return "general";
}

function getEndpointUrl() {
  const explicit = process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT?.trim() ?? "";
  if (explicit) return explicit;

  const base =
    process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL?.trim() ||
    process.env.NEXT_PUBLIC_DOWNLOAD_LEAD_ENDPOINT?.trim() ||
    "";

  if (!base) return "";

  if (base.endsWith("/capture-download-lead")) {
    return `${base.slice(0, -"/capture-download-lead".length)}/capture-feedback`;
  }

  if (base.endsWith("/capture-download-lead/")) {
    return `${base.slice(0, -"/capture-download-lead/".length)}/capture-feedback`;
  }

  if (base.includes(".functions.supabase.co")) {
    return `${base.replace(/\/+$/, "")}/capture-feedback`;
  }

  return "";
}

const ENDPOINT_URL = getEndpointUrl();

export default function FeedbackForm() {
  const [type, setType] = useState<FeedbackType>("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState("");
  const [appVersion, setAppVersion] = useState("");
  const [message, setMessage] = useState("");
  const [stepsToReproduce, setStepsToReproduce] = useState("");
  const [expectedBehavior, setExpectedBehavior] = useState("");
  const [actualBehavior, setActualBehavior] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const requestedType = normalizeType((params.get("type") ?? "").toLowerCase());
    setType(requestedType);
  }, []);

  const endpointAvailable = useMemo(() => Boolean(ENDPOINT_URL), []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!ENDPOINT_URL) {
      setSubmitState("error");
      setErrorMessage("Feedback form is not configured yet. Please try again shortly.");
      return;
    }

    setSubmitState("submitting");
    setErrorMessage("");

    const payload = {
      type,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      platform: platform.trim(),
      appVersion: appVersion.trim(),
      message: message.trim(),
      stepsToReproduce: stepsToReproduce.trim(),
      expectedBehavior: expectedBehavior.trim(),
      actualBehavior: actualBehavior.trim(),
      consent,
      company: company.trim(),
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
      setName("");
      setEmail("");
      setPlatform("");
      setAppVersion("");
      setMessage("");
      setStepsToReproduce("");
      setExpectedBehavior("");
      setActualBehavior("");
      setConsent(false);
      setCompany("");
    } catch {
      setSubmitState("error");
      setErrorMessage("We could not submit your feedback right now. Please try again.");
    }
  };

  const summaryLabel = type === "feature" ? "Feature Idea" : type === "bug" ? "Issue Summary" : "Feedback";
  const typeHelpTitle =
    type === "bug"
      ? "What helps us fix bugs faster"
      : type === "feature"
        ? "What makes feature requests actionable"
        : "What makes general feedback useful";
  const typeHelpItems =
    type === "bug"
      ? [
          "Tell us what you clicked right before the issue.",
          "Share expected vs actual behavior clearly.",
          "Include OS and app version if possible.",
        ]
      : type === "feature"
        ? [
            "Describe the problem this feature would solve.",
            "Share who would use it and how often.",
            "Give an example workflow from your service.",
          ]
        : [
            "Share what is working well or feels confusing.",
            "Tell us where in your service flow this happens.",
            "Include one concrete suggestion if possible.",
          ];
  return (
    <section className="feedback-form-section">
      <article className={`feedback-form-card feedback-form-card-${type} install-card reveal`}>
        <div className="feedback-form-head">
          <h2>Send Feedback</h2>
          <p>Share bugs, feature requests, or quick product feedback. No GitHub account required.</p>
        </div>

        {!endpointAvailable ? (
          <p className="feedback-alert feedback-alert-error">
            Feedback endpoint is missing. Set NEXT_PUBLIC_FEEDBACK_ENDPOINT or NEXT_PUBLIC_SUPABASE_FUNCTION_URL.
          </p>
        ) : null}

        <form className="feedback-form" onSubmit={onSubmit}>
          <fieldset className="feedback-type-group" disabled={submitState === "submitting"}>
            <legend>Feedback Type</legend>
            <div className="feedback-type-options" role="radiogroup" aria-label="Feedback type">
              <button
                type="button"
                className={`feedback-type-chip${type === "general" ? " is-active" : ""}`}
                onClick={() => setType("general")}
                role="radio"
                aria-checked={type === "general"}
              >
                General
              </button>
              <button
                type="button"
                className={`feedback-type-chip${type === "bug" ? " is-active" : ""}`}
                onClick={() => setType("bug")}
                role="radio"
                aria-checked={type === "bug"}
              >
                Bug
              </button>
              <button
                type="button"
                className={`feedback-type-chip${type === "feature" ? " is-active" : ""}`}
                onClick={() => setType("feature")}
                role="radio"
                aria-checked={type === "feature"}
              >
                Feature
              </button>
            </div>
          </fieldset>

          <div className="feedback-form-row">
            <div className="feedback-field">
              <label htmlFor="feedback-name">Name</label>
              <input
                id="feedback-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                maxLength={80}
                required
                autoComplete="name"
                disabled={submitState === "submitting"}
              />
            </div>

            <div className="feedback-field">
              <label htmlFor="feedback-email">Email</label>
              <input
                id="feedback-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                maxLength={120}
                required
                autoComplete="email"
                disabled={submitState === "submitting"}
              />
            </div>
          </div>

          <div className="feedback-form-row">
            <div className="feedback-field">
              <label htmlFor="feedback-platform">Platform</label>
              <input
                id="feedback-platform"
                type="text"
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
                maxLength={80}
                placeholder="macOS / Windows"
                disabled={submitState === "submitting"}
              />
            </div>

            <div className="feedback-field">
              <label htmlFor="feedback-version">App Version</label>
              <input
                id="feedback-version"
                type="text"
                value={appVersion}
                onChange={(event) => setAppVersion(event.target.value)}
                maxLength={80}
                placeholder="e.g. 2.0.7"
                disabled={submitState === "submitting"}
              />
            </div>
          </div>

          <div className={`feedback-type-tip feedback-type-tip-${type}`} role="note">
            <h3>{typeHelpTitle}</h3>
            <ul>
              {typeHelpItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {type === "bug" ? (
            <div className="feedback-bug-grid">
              <div className="feedback-field">
                <label htmlFor="feedback-steps">Steps to Reproduce</label>
                <textarea
                  id="feedback-steps"
                  value={stepsToReproduce}
                  onChange={(event) => setStepsToReproduce(event.target.value)}
                  rows={4}
                  maxLength={4000}
                  placeholder="1) Go to... 2) Click... 3) Observe..."
                  disabled={submitState === "submitting"}
                />
              </div>

              <div className="feedback-form-row feedback-form-row-compact">
                <div className="feedback-field">
                  <label htmlFor="feedback-expected">Expected Behavior</label>
                  <textarea
                    id="feedback-expected"
                    value={expectedBehavior}
                    onChange={(event) => setExpectedBehavior(event.target.value)}
                    rows={3}
                    maxLength={4000}
                    disabled={submitState === "submitting"}
                  />
                </div>

                <div className="feedback-field">
                  <label htmlFor="feedback-actual">Actual Behavior</label>
                  <textarea
                    id="feedback-actual"
                    value={actualBehavior}
                    onChange={(event) => setActualBehavior(event.target.value)}
                    rows={3}
                    maxLength={4000}
                    disabled={submitState === "submitting"}
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div className="feedback-field">
            <label htmlFor="feedback-message">{summaryLabel}</label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              minLength={10}
              maxLength={4000}
              required
              disabled={submitState === "submitting"}
            />
            <p className="feedback-helper-text">{message.length}/4000 characters</p>
          </div>

          <input
            type="text"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
          />

          <label className="feedback-consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              required
              disabled={submitState === "submitting"}
            />
            <span>
              I agree that StageFlo can store this feedback to respond and improve the product as described in
              <a href="/privacy/" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>.
            </span>
          </label>

          {submitState === "error" ? <p className="feedback-alert feedback-alert-error">{errorMessage}</p> : null}
          {submitState === "success" ? <p className="feedback-alert feedback-alert-success">Thanks. Your feedback was submitted.</p> : null}

          <div className="feedback-actions cta-row">
            <button
              type="submit"
              className="button button-primary"
              disabled={submitState === "submitting" || !endpointAvailable}
            >
              {submitState === "submitting" ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </article>
    </section>
  );
}