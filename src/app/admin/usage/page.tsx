"use client";

import { useMemo, useState } from "react";

type UsageSummary = {
  totalInstalls: number;
  active24h: number;
  active7d: number;
  active30d: number;
  launchCountSum: number;
  averageLaunchesPerInstall: number;
  versionCounts: Array<{ version: string; installs: number }>;
  platformCounts: Array<{ platform: string; installs: number }>;
  tunnelModeCounts: Array<{ mode: string; installs: number }>;
  tunnelActiveCount: number;
  dailyActive: Array<{ day: string; installs: number }>;
};

type InstallRow = {
  install_id: string;
  first_seen_at: string;
  last_seen_at: string;
  first_version: string;
  last_version: string;
  launch_count: number;
  platform: string;
  arch: string;
  electron_version: string;
  node_version: string;
  app_name: string;
  is_packaged: boolean;
  tunnel_mode: string | null;
  tunnel_active: boolean;
  tunnel_hostname: string | null;
};

type LoadState = "idle" | "loading" | "error";

const CAPTURE_ENDPOINT = process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL?.trim() || "";
const USAGE_ENDPOINT = CAPTURE_ENDPOINT
  ? CAPTURE_ENDPOINT.replace(/capture-download-lead\/?$/, "usage-admin")
  : "";

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return "0%";
  return `${Math.round(value)}%`;
}

export default function UsageAdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [days, setDays] = useState("30");
  const [platform, setPlatform] = useState("");
  const [tunnelMode, setTunnelMode] = useState("");
  const [version, setVersion] = useState("");
  const [query, setQuery] = useState("");
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [installs, setInstalls] = useState<InstallRow[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [error, setError] = useState("");
  const [sampled, setSampled] = useState(false);

  const canLoad = useMemo(() => Boolean(USAGE_ENDPOINT && adminKey.trim()), [adminKey]);

  const maxDaily = useMemo(() => {
    if (!summary || summary.dailyActive.length === 0) return 1;
    return Math.max(1, ...summary.dailyActive.map((item) => item.installs));
  }, [summary]);

  const topVersion = useMemo(() => summary?.versionCounts[0] ?? null, [summary]);
  const topPlatform = useMemo(() => summary?.platformCounts[0] ?? null, [summary]);
  const topTunnelMode = useMemo(() => summary?.tunnelModeCounts[0] ?? null, [summary]);

  const tunnelCoveragePercent = useMemo(() => {
    if (!summary || summary.totalInstalls <= 0) return 0;
    return (summary.tunnelActiveCount / summary.totalInstalls) * 100;
  }, [summary]);

  const loadUsage = async () => {
    if (!USAGE_ENDPOINT) {
      setError("Usage endpoint is missing. Set NEXT_PUBLIC_SUPABASE_FUNCTION_URL.");
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
      params.set("limit", "1000");
      params.set("days", days.trim() || "30");
      if (platform.trim()) params.set("platform", platform.trim());
      if (tunnelMode.trim()) params.set("tunnelMode", tunnelMode.trim());
      if (version.trim()) params.set("version", version.trim());
      if (query.trim()) params.set("q", query.trim());

      const response = await fetch(`${USAGE_ENDPOINT}?${params.toString()}`, {
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
      setInstalls(Array.isArray(data?.installs) ? data.installs : []);
      setLoadState("idle");
    } catch (loadError) {
      setLoadState("error");
      setError(loadError instanceof Error ? loadError.message : "Failed to load usage metrics.");
    }
  };

  return (
    <main className="admin-page-wrap">
      <section className="admin-panel usage-admin-panel">
        <div className="usage-hero">
          <div>
            <h1>App Usage Dashboard</h1>
            <p>Modern analytics for installs, activity, version spread, and tunnel adoption.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a className="button button-secondary" href="/admin/leads">
              Open Leads Admin
            </a>
            <a className="button button-secondary" href="/admin/crashes">
              Open Crash Reports
            </a>
          </div>
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
              Days in Trend
              <input type="number" min={1} max={120} value={days} onChange={(event) => setDays(event.target.value)} />
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
              Tunnel Mode
              <input
                type="text"
                value={tunnelMode}
                onChange={(event) => setTunnelMode(event.target.value)}
                placeholder="named, quick, none"
              />
            </label>

            <label>
              Version
              <input
                type="text"
                value={version}
                onChange={(event) => setVersion(event.target.value)}
                placeholder="2.0.4"
              />
            </label>

            <label>
              Search
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="install id, version, arch"
              />
            </label>
          </div>

          <div className="admin-actions">
            <button className="button button-primary" onClick={loadUsage} disabled={!canLoad || loadState === "loading"}>
              {loadState === "loading" ? "Loading..." : "Load Usage"}
            </button>
          </div>
        </div>

        {sampled ? <p className="admin-error">Showing sampled rows (limit reached). Narrow filters for exact totals.</p> : null}
        {error ? <p className="admin-error">{error}</p> : null}

        {summary ? (
          <>
            <div className="usage-kpi-grid">
              <article className="usage-kpi-card usage-kpi-strong">
                <span className="usage-kpi-label">Total Installs</span>
                <strong className="usage-kpi-value">{summary.totalInstalls}</strong>
              </article>
              <article className="usage-kpi-card">
                <span className="usage-kpi-label">Active 24h</span>
                <strong className="usage-kpi-value">{summary.active24h}</strong>
              </article>
              <article className="usage-kpi-card">
                <span className="usage-kpi-label">Active 7d</span>
                <strong className="usage-kpi-value">{summary.active7d}</strong>
              </article>
              <article className="usage-kpi-card">
                <span className="usage-kpi-label">Active 30d</span>
                <strong className="usage-kpi-value">{summary.active30d}</strong>
              </article>
              <article className="usage-kpi-card">
                <span className="usage-kpi-label">Total Launches</span>
                <strong className="usage-kpi-value">{summary.launchCountSum}</strong>
              </article>
              <article className="usage-kpi-card">
                <span className="usage-kpi-label">Tunnel Adoption</span>
                <strong className="usage-kpi-value">{formatPercent(tunnelCoveragePercent)}</strong>
              </article>
            </div>

            <div className="usage-insights-grid">
              <section className="usage-panel-card">
                <h3>Daily Activity</h3>
                <p>Active installs by day for the selected window.</p>
                <div className="usage-mini-chart">
                  {summary.dailyActive.map((row) => (
                    <div key={row.day} className="usage-mini-bar-wrap" title={`${row.day}: ${row.installs}`}>
                      <div
                        className="usage-mini-bar"
                        style={{ height: `${Math.max(6, Math.round((row.installs / maxDaily) * 100))}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="usage-mini-chart-labels">
                  <span>{summary.dailyActive[0]?.day ?? "-"}</span>
                  <span>{summary.dailyActive[summary.dailyActive.length - 1]?.day ?? "-"}</span>
                </div>
              </section>

              <section className="usage-panel-card">
                <h3>Top Signals</h3>
                <p>Fast read of what is currently dominant.</p>
                <ul className="usage-highlights">
                  <li>
                    <span>Top Version</span>
                    <strong>{topVersion ? `${topVersion.version} (${topVersion.installs})` : "-"}</strong>
                  </li>
                  <li>
                    <span>Top Platform</span>
                    <strong>{topPlatform ? `${topPlatform.platform} (${topPlatform.installs})` : "-"}</strong>
                  </li>
                  <li>
                    <span>Top Tunnel Mode</span>
                    <strong>{topTunnelMode ? `${topTunnelMode.mode} (${topTunnelMode.installs})` : "-"}</strong>
                  </li>
                  <li>
                    <span>Avg Launches / Install</span>
                    <strong>{summary.averageLaunchesPerInstall}</strong>
                  </li>
                </ul>
              </section>
            </div>

            <div className="usage-distribution-grid">
              <section className="usage-panel-card">
                <h3>Version Distribution</h3>
                <div className="usage-distribution-list">
                  {summary.versionCounts.slice(0, 8).map((row) => (
                    <div key={row.version} className="usage-distribution-row">
                      <span>{row.version}</span>
                      <div className="usage-distribution-track">
                        <div
                          className="usage-distribution-fill usage-fill-version"
                          style={{ width: `${(row.installs / Math.max(1, summary.totalInstalls)) * 100}%` }}
                        />
                      </div>
                      <strong>{row.installs}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="usage-panel-card">
                <h3>Platform Distribution</h3>
                <div className="usage-distribution-list">
                  {summary.platformCounts.map((row) => (
                    <div key={row.platform} className="usage-distribution-row">
                      <span>{row.platform}</span>
                      <div className="usage-distribution-track">
                        <div
                          className="usage-distribution-fill usage-fill-platform"
                          style={{ width: `${(row.installs / Math.max(1, summary.totalInstalls)) * 100}%` }}
                        />
                      </div>
                      <strong>{row.installs}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="usage-panel-card">
                <h3>Tunnel Distribution</h3>
                <div className="usage-distribution-list">
                  {summary.tunnelModeCounts.map((row) => (
                    <div key={row.mode} className="usage-distribution-row">
                      <span>{row.mode}</span>
                      <div className="usage-distribution-track">
                        <div
                          className="usage-distribution-fill usage-fill-tunnel"
                          style={{ width: `${(row.installs / Math.max(1, summary.totalInstalls)) * 100}%` }}
                        />
                      </div>
                      <strong>{row.installs}</strong>
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
                <th>Install ID</th>
                <th>First Seen</th>
                <th>Last Seen</th>
                <th>First Version</th>
                <th>Active Version</th>
                <th>Launches</th>
                <th>Platform</th>
                <th>Arch</th>
                <th>Tunnel</th>
                <th>Tunnel Host</th>
              </tr>
            </thead>
            <tbody>
              {installs.length === 0 ? (
                <tr>
                  <td colSpan={10}>No installs loaded.</td>
                </tr>
              ) : (
                installs.map((row) => (
                  <tr key={row.install_id}>
                    <td>{row.install_id}</td>
                    <td>{formatDate(row.first_seen_at)}</td>
                    <td>{formatDate(row.last_seen_at)}</td>
                    <td>{row.first_version || "-"}</td>
                    <td>{row.last_version || "-"}</td>
                    <td>{row.launch_count}</td>
                    <td>{row.platform || "-"}</td>
                    <td>{row.arch || "-"}</td>
                    <td>
                      <span className={`usage-tunnel-badge ${row.tunnel_active ? "active" : "inactive"}`}>
                        {row.tunnel_mode ? row.tunnel_mode : "none"}
                      </span>
                    </td>
                    <td>{row.tunnel_hostname || "-"}</td>
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