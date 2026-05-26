"use client";

import { useMemo, useState } from "react";

type EmailStatus = "pending" | "sent" | "failed" | "skipped";

type LeadRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  source: "desktop" | "resource";
  download_url: string;
  page: string;
  email_status: EmailStatus;
  email_attempt_count: number;
  email_last_attempt_at: string | null;
  email_sent_at: string | null;
  email_error: string;
  email_provider_message_id: string;
  onboarding_step_2_sent_at: string | null;
  onboarding_step_3_sent_at: string | null;
  onboarding_step_4_sent_at: string | null;
  onboarding_sequence_completed_at: string | null;
  onboarding_attempt_count: number;
  onboarding_last_attempt_at: string | null;
  onboarding_last_error: string;
};

type UsageSummary = {
  totalInstalls: number;
  active7d: number;
  active30d: number;
  versionCounts: Array<{ version: string; installs: number }>;
};

type LoadState = "idle" | "loading" | "error";

const CAPTURE_ENDPOINT = process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL?.trim() || "";
const ADMIN_ENDPOINT = CAPTURE_ENDPOINT
  ? CAPTURE_ENDPOINT.replace(/capture-download-lead\/?$/, "download-leads-admin")
  : "";

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

export default function LeadsAdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | EmailStatus>("");
  const [query, setQuery] = useState("");
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [error, setError] = useState("");
  const [retryingId, setRetryingId] = useState("");

  const canLoad = useMemo(() => Boolean(ADMIN_ENDPOINT && adminKey.trim()), [adminKey]);

  const loadLeads = async () => {
    if (!ADMIN_ENDPOINT) {
      setError("Admin endpoint is missing. Set NEXT_PUBLIC_SUPABASE_FUNCTION_URL.");
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
      params.set("limit", "100");
      if (statusFilter) params.set("status", statusFilter);
      if (query.trim()) params.set("q", query.trim());

      const response = await fetch(`${ADMIN_ENDPOINT}?${params.toString()}`, {
        headers: {
          "x-admin-key": adminKey.trim(),
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : `Request failed with status ${response.status}`);
      }

      setLeads(Array.isArray(data?.leads) ? data.leads : []);
      setUsage(
        data?.usage && typeof data.usage === "object"
          ? {
              totalInstalls: Number(data.usage.totalInstalls ?? 0),
              active7d: Number(data.usage.active7d ?? 0),
              active30d: Number(data.usage.active30d ?? 0),
              versionCounts: Array.isArray(data.usage.versionCounts)
                ? data.usage.versionCounts
                    .map((row: { version?: unknown; installs?: unknown }) => ({
                      version: typeof row.version === "string" ? row.version : "unknown",
                      installs: Number(row.installs ?? 0),
                    }))
                    .filter((row: { version: string; installs: number }) => Number.isFinite(row.installs))
                : [],
            }
          : null
      );
      setLoadState("idle");
    } catch (loadError) {
      setLoadState("error");
      setError(loadError instanceof Error ? loadError.message : "Failed to load leads.");
    }
  };

  const retryLead = async (lead: LeadRow) => {
    if (!ADMIN_ENDPOINT || !adminKey.trim()) {
      setError("Enter admin key and reload leads first.");
      return;
    }

    setRetryingId(lead.id);
    setError("");

    try {
      const response = await fetch(ADMIN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify({ id: lead.id }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : `Retry failed with status ${response.status}`);
      }

      await loadLeads();
    } catch (retryError) {
      setError(retryError instanceof Error ? retryError.message : "Retry failed.");
    } finally {
      setRetryingId("");
    }
  };

  return (
    <main className="admin-page-wrap">
      <section className="admin-panel">
        <h1>Email Delivery Admin</h1>
        <p>View download leads and retry failed or skipped thank-you emails.</p>
        <p>Onboarding sequence tracking: Day 2, Day 4, Day 7, and completion status.</p>
        <p>
          Need install/version analytics? <a href="/admin/usage">Open usage dashboard</a>.
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
            Status
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "" | EmailStatus)}>
              <option value="">All</option>
              <option value="pending">pending</option>
              <option value="sent">sent</option>
              <option value="failed">failed</option>
              <option value="skipped">skipped</option>
            </select>
          </label>

          <label>
            Search
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name or email"
            />
          </label>
        </div>

        <div className="admin-actions">
          <button className="button button-primary" onClick={loadLeads} disabled={!canLoad || loadState === "loading"}>
            {loadState === "loading" ? "Loading..." : "Load Leads"}
          </button>
        </div>

        {usage ? (
          <div className="admin-table-wrap" style={{ marginBottom: "1rem" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Total Installs</th>
                  <th>Active (7d)</th>
                  <th>Active (30d)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{usage.totalInstalls}</td>
                  <td>{usage.active7d}</td>
                  <td>{usage.active30d}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}

        {usage && usage.versionCounts.length > 0 ? (
          <div className="admin-table-wrap" style={{ marginBottom: "1rem" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Version</th>
                  <th>Installs</th>
                </tr>
              </thead>
              <tbody>
                {usage.versionCounts.map((row) => (
                  <tr key={row.version}>
                    <td>{row.version}</td>
                    <td>{row.installs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {error ? <p className="admin-error">{error}</p> : null}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Created</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Attempts</th>
                <th>Last Attempt</th>
                <th>Day 2</th>
                <th>Day 4</th>
                <th>Day 7</th>
                <th>Onboarding Done</th>
                <th>Onb Attempts</th>
                <th>Onb Last Attempt</th>
                <th>Onb Error</th>
                <th>Error</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={15}>No leads loaded.</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{formatDate(lead.created_at)}</td>
                    <td>{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>
                      <span className={`status-pill status-${lead.email_status}`}>{lead.email_status}</span>
                    </td>
                    <td>{lead.email_attempt_count}</td>
                    <td>{formatDate(lead.email_last_attempt_at)}</td>
                    <td>{formatDate(lead.onboarding_step_2_sent_at)}</td>
                    <td>{formatDate(lead.onboarding_step_3_sent_at)}</td>
                    <td>{formatDate(lead.onboarding_step_4_sent_at)}</td>
                    <td>{formatDate(lead.onboarding_sequence_completed_at)}</td>
                    <td>{lead.onboarding_attempt_count ?? 0}</td>
                    <td>{formatDate(lead.onboarding_last_attempt_at)}</td>
                    <td className="admin-error-cell">{lead.onboarding_last_error || "-"}</td>
                    <td className="admin-error-cell">{lead.email_error || "-"}</td>
                    <td>
                      {lead.email_status === "sent" ? (
                        <button
                          className="button button-danger"
                          onClick={() => retryLead(lead)}
                          disabled={retryingId === lead.id}
                          title="Email already sent — click to force resend"
                        >
                          {retryingId === lead.id ? "Sending..." : "Force Resend"}
                        </button>
                      ) : (
                        <button
                          className="button button-secondary"
                          onClick={() => retryLead(lead)}
                          disabled={retryingId === lead.id}
                        >
                          {retryingId === lead.id ? "Retrying..." : "Retry"}
                        </button>
                      )}
                    </td>
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
