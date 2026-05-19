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
      <section className="admin-panel">
        <h1>App Usage Dashboard</h1>
        <p>Track active installs, versions, platforms, and recent activity trends.</p>
        <p>
          Need email lead tools? <a href="/admin/leads">Open leads admin</a>.
        </p>

        <div className="admin-controls">
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
            Platform Filter
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
        </div>

        <div className="admin-controls">
          <label>
            Version Filter
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

        {sampled ? <p className="admin-error">Showing a sampled set (limit reached). Narrow filters for exact counts.</p> : null}
        {error ? <p className="admin-error">{error}</p> : null}

        {summary ? (
          <div className="admin-table-wrap" style={{ marginBottom: "1rem" }}>
            <table className="admin-table" style={{ minWidth: "680px" }}>
              <thead>
                <tr>
                  <th>Total Installs</th>
                  <th>Active 24h</th>
                  <th>Active 7d</th>
                  <th>Active 30d</th>
                  <th>Launches (sum)</th>
                  <th>Avg launches/install</th>
                  <th>Tunnel Active</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{summary.totalInstalls}</td>
                  <td>{summary.active24h}</td>
                  <td>{summary.active7d}</td>
                  <td>{summary.active30d}</td>
                  <td>{summary.launchCountSum}</td>
                  <td>{summary.averageLaunchesPerInstall}</td>
                  <td>{summary.tunnelActiveCount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}

        {summary && summary.dailyActive.length > 0 ? (
          <div className="admin-table-wrap" style={{ marginBottom: "1rem" }}>
            <table className="admin-table" style={{ minWidth: "680px" }}>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Active Installs</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {summary.dailyActive.map((row) => (
                  <tr key={row.day}>
                    <td>{row.day}</td>
                    <td>{row.installs}</td>
                    <td>
                      <div
                        style={{
                          height: "8px",
                          width: `${Math.max(2, Math.round((row.installs / maxDaily) * 100))}%`,
                          background: "linear-gradient(90deg, #7c3aed, #22d3ee)",
                          borderRadius: "999px",
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {summary && summary.versionCounts.length > 0 ? (
          <div className="admin-table-wrap" style={{ marginBottom: "1rem" }}>
            <table className="admin-table" style={{ minWidth: "680px" }}>
              <thead>
                <tr>
                  <th>Version</th>
                  <th>Installs</th>
                </tr>
              </thead>
              <tbody>
                {summary.versionCounts.map((row) => (
                  <tr key={row.version}>
                    <td>{row.version}</td>
                    <td>{row.installs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {summary && summary.platformCounts.length > 0 ? (
          <div className="admin-table-wrap" style={{ marginBottom: "1rem" }}>
            <table className="admin-table" style={{ minWidth: "680px" }}>
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Installs</th>
                </tr>
              </thead>
              <tbody>
                {summary.platformCounts.map((row) => (
                  <tr key={row.platform}>
                    <td>{row.platform}</td>
                    <td>{row.installs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {summary && summary.tunnelModeCounts.length > 0 ? (
          <div className="admin-table-wrap" style={{ marginBottom: "1rem" }}>
            <table className="admin-table" style={{ minWidth: "680px" }}>
              <thead>
                <tr>
                  <th>Tunnel Mode</th>
                  <th>Installs</th>
                </tr>
              </thead>
              <tbody>
                {summary.tunnelModeCounts.map((row) => (
                  <tr key={row.mode}>
                    <td>{row.mode}</td>
                    <td>{row.installs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="admin-table-wrap">
          <table className="admin-table">
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
                    <td>{row.tunnel_mode ? `${row.tunnel_mode}${row.tunnel_active ? " (active)" : ""}` : row.tunnel_active ? "active" : "none"}</td>
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