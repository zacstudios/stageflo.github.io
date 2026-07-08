"use client";

import { useMemo, useState } from "react";

type CrashGroup = {
  kind: string;
  message: string;
  hits: number;
  installs: number;
  lastSeen: string;
  versions: string[];
};

type CrashSummary = {
  totalCrashes: number;
  affectedInstalls: number;
  crashes24h: number;
  crashes7d: number;
  kindCounts: Array<{ kind: string; crashes: number }>;
  versionCounts: Array<{ version: string; crashes: number }>;
  platformCounts: Array<{ platform: string; crashes: number }>;
  dailyCrashes: Array<{ day: string; crashes: number }>;
  topGroups: CrashGroup[];
};

type CrashRow = {
  id: string;
  created_at: string;
  install_id: string;
  session_id: string;
  app_version: string;
  platform: string;
  arch: string;
  electron_version: string;
  is_packaged: boolean;
  kind: string;
  source: string;
  message: string;
  stack: string;
  occurred_at: string;
};

type LoadState = "idle" | "loading" | "error";

const CAPTURE_ENDPOINT = process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL?.trim() || "";
const CRASH_ENDPOINT = CAPTURE_ENDPOINT
  ? CAPTURE_ENDPOINT.replace(/capture-download-lead\/?$/, "crash-admin")
  : "";

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

export default function CrashAdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [days, setDays] = useState("30");
  const [kind, setKind] = useState("");
  const [platform, setPlatform] = useState("");
  const [version, setVersion] = useState("");
  const [query, setQuery] = useState("");
  const [summary, setSummary] = useState<CrashSummary | null>(null);
  const [crashes, setCrashes] = useState<CrashRow[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [error, setError] = useState("");
  const [sampled, setSampled] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const canLoad = useMemo(() => Boolean(CRASH_ENDPOINT && adminKey.trim()), [adminKey]);

  const maxDaily = useMemo(() => {
    if (!summary || summary.dailyCrashes.length === 0) return 1;
    return Math.max(1, ...summary.dailyCrashes.map((item) => item.crashes));
  }, [summary]);

  const loadCrashes = async () => {
    if (!CRASH_ENDPOINT) {
      setError("Crash endpoint is missing. Set NEXT_PUBLIC_SUPABASE_FUNCTION_URL.");
      setLoadState("error");
      return;
    }

    if (!adminKey.trim()) {
      setError("Enter your admin API key.");
      setLoadState("error");
      return;
    }

    setLoadState("loading");
    setError("");

    try {
      const params = new URLSearchParams();
      params.set("limit", "2000");
      params.set("days", days.trim() || "30");
      if (kind.trim()) params.set("kind", kind.trim());
      if (platform.trim()) params.set("platform", platform.trim());
      if (version.trim()) params.set("version", version.trim());
      if (query.trim()) params.set("q", query.trim());

      const response = await fetch(`${CRASH_ENDPOINT}?${params.toString()}`, {
        headers: {
          "x-admin-key": adminKey.trim(),
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : `Request failed with status ${response.status}`);
      }

      setSampled(Boolean(data?.sampled));
      setSummary(data?.summary ?? null);
      setCrashes(Array.isArray(data?.crashes) ? data.crashes : []);
      setExpandedId(null);
      setLoadState("idle");
    } catch (loadError) {
      setLoadState("error");
      setError(loadError instanceof Error ? loadError.message : "Failed to load crash reports.");
    }
  };

  return (
    <main className="admin-page-wrap">
      <section className="admin-panel usage-admin-panel">
        <div className="usage-hero">
          <div>
            <h1>Crash Reports Dashboard</h1>
            <p>Crashes and unhandled errors reported by StageFlo installs, grouped for fast triage.</p>
          </div>
          <a className="button button-secondary" href="/admin/usage">
            Open Usage Admin
          </a>
        </div>

        <div className="usage-filter-card">
          <div className="admin-controls usage-controls">
            <label>
              Admin API Key
              <input
                type="password"
                value={adminKey}
                onChange={(event) => setAdminKey(event.target.value)}
                placeholder="Enter ADMIN_API_KEY"
              />
            </label>

            <label>
              Days in Window
              <input type="number" min={1} max={120} value={days} onChange={(event) => setDays(event.target.value)} />
            </label>

            <label>
              Kind
              <input
                type="text"
                value={kind}
                onChange={(event) => setKind(event.target.value)}
                placeholder="renderer-error-boundary, render-process-gone"
              />
            </label>

            <label>
              Platform
              <input
                type="text"
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
                placeholder="darwin, win32, linux"
              />
            </label>

            <label>
              Version
              <input
                type="text"
                value={version}
                onChange={(event) => setVersion(event.target.value)}
                placeholder="2.1.20"
              />
            </label>

            <label>
              Search
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="message, stack, install id"
              />
            </label>
          </div>

          <div className="admin-actions">
            <button className="button button-primary" onClick={loadCrashes} disabled={!canLoad || loadState === "loading"}>
              {loadState === "loading" ? "Loading..." : "Load Crashes"}
            </button>
          </div>
        </div>

        {sampled ? <p className="admin-error">Showing sampled rows (limit reached). Narrow filters for exact totals.</p> : null}
        {error ? <p className="admin-error">{error}</p> : null}

        {summary ? (
          <>
            <div className="usage-kpi-grid">
              <article className="usage-kpi-card usage-kpi-strong">
                <span className="usage-kpi-label">Total Crashes</span>
                <strong className="usage-kpi-value">{summary.totalCrashes}</strong>
              </article>
              <article className="usage-kpi-card">
                <span className="usage-kpi-label">Churches Affected</span>
                <strong className="usage-kpi-value">{summary.affectedInstalls}</strong>
              </article>
              <article className="usage-kpi-card">
                <span className="usage-kpi-label">Last 24h</span>
                <strong className="usage-kpi-value">{summary.crashes24h}</strong>
              </article>
              <article className="usage-kpi-card">
                <span className="usage-kpi-label">Last 7d</span>
                <strong className="usage-kpi-value">{summary.crashes7d}</strong>
              </article>
            </div>

            <div className="usage-insights-grid">
              <section className="usage-panel-card">
                <h3>Daily Crashes</h3>
                <p>Crash volume by day for the selected window.</p>
                <div className="usage-mini-chart">
                  {summary.dailyCrashes.map((row) => (
                    <div key={row.day} className="usage-mini-bar-wrap" title={`${row.day}: ${row.crashes}`}>
                      <div
                        className="usage-mini-bar"
                        style={{ height: `${Math.max(6, Math.round((row.crashes / maxDaily) * 100))}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="usage-mini-chart-labels">
                  <span>{summary.dailyCrashes[0]?.day ?? "-"}</span>
                  <span>{summary.dailyCrashes[summary.dailyCrashes.length - 1]?.day ?? "-"}</span>
                </div>
              </section>

              <section className="usage-panel-card">
                <h3>Top Crash Groups</h3>
                <p>Same error grouped across installs. Fix these first.</p>
                <div className="usage-distribution-list">
                  {summary.topGroups.length === 0 ? (
                    <p>No crashes in this window.</p>
                  ) : (
                    summary.topGroups.slice(0, 8).map((group) => (
                      <div key={`${group.kind}-${group.message}`} className="usage-distribution-row" title={group.message}>
                        <span>
                          <strong>{group.hits}×</strong> [{group.kind}] {group.message.slice(0, 80)}
                          {group.message.length > 80 ? "…" : ""}
                        </span>
                        <strong>{group.installs} install{group.installs === 1 ? "" : "s"}</strong>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            <div className="usage-distribution-grid">
              <section className="usage-panel-card">
                <h3>By Kind</h3>
                <div className="usage-distribution-list">
                  {summary.kindCounts.map((row) => (
                    <div key={row.kind} className="usage-distribution-row">
                      <span>{row.kind}</span>
                      <div className="usage-distribution-track">
                        <div
                          className="usage-distribution-fill usage-fill-version"
                          style={{ width: `${(row.crashes / Math.max(1, summary.totalCrashes)) * 100}%` }}
                        />
                      </div>
                      <strong>{row.crashes}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="usage-panel-card">
                <h3>By Version</h3>
                <div className="usage-distribution-list">
                  {summary.versionCounts.slice(0, 8).map((row) => (
                    <div key={row.version} className="usage-distribution-row">
                      <span>{row.version}</span>
                      <div className="usage-distribution-track">
                        <div
                          className="usage-distribution-fill usage-fill-platform"
                          style={{ width: `${(row.crashes / Math.max(1, summary.totalCrashes)) * 100}%` }}
                        />
                      </div>
                      <strong>{row.crashes}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="usage-panel-card">
                <h3>By Platform</h3>
                <div className="usage-distribution-list">
                  {summary.platformCounts.map((row) => (
                    <div key={row.platform} className="usage-distribution-row">
                      <span>{row.platform}</span>
                      <div className="usage-distribution-track">
                        <div
                          className="usage-distribution-fill usage-fill-tunnel"
                          style={{ width: `${(row.crashes / Math.max(1, summary.totalCrashes)) * 100}%` }}
                        />
                      </div>
                      <strong>{row.crashes}</strong>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : null}

        <div className="admin-table-wrap">
          <table className="admin-table usage-installs-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Kind</th>
                <th>Source</th>
                <th>Version</th>
                <th>Platform</th>
                <th>Message</th>
                <th>Install</th>
              </tr>
            </thead>
            <tbody>
              {crashes.length === 0 ? (
                <tr>
                  <td colSpan={7}>No crash reports loaded.</td>
                </tr>
              ) : (
                crashes.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                    style={{ cursor: "pointer" }}
                    title="Click to toggle full message and stack"
                  >
                    <td>{formatDate(row.created_at)}</td>
                    <td>{row.kind}</td>
                    <td>{row.source || "-"}</td>
                    <td>{row.app_version || "-"}</td>
                    <td>{row.platform || "-"}</td>
                    <td style={{ maxWidth: 420 }}>
                      {expandedId === row.id ? (
                        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>
                          {row.message}
                          {row.stack ? `\n\n${row.stack}` : ""}
                        </pre>
                      ) : (
                        <>
                          {row.message.slice(0, 140)}
                          {row.message.length > 140 ? "…" : ""}
                        </>
                      )}
                    </td>
                    <td>{row.install_id.slice(0, 8)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
