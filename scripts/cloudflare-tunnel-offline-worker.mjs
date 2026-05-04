const OFFLINE_STATUS_CODES = new Set([502, 503, 504, 530]);

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderOfflinePage(host, path) {
  const safeHost = escapeHtml(host || 'Unknown host');
  const safePath = escapeHtml(path || '/');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>StageFlo | App Offline</title>
    <meta name="robots" content="noindex,nofollow" />
    <style>
      :root {
        --bg: #0f0f1a;
        --bg-mid: #0d1120;
        --ink: #f1f5f9;
        --muted: #94a3b8;
        --line: rgba(124, 58, 237, 0.24);
        --panel: rgba(18, 26, 47, 0.92);
        --accent-light: #c4b5fd;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 1.5rem;
        color: var(--ink);
        background:
          radial-gradient(ellipse at 10% -4%, rgba(124, 58, 237, 0.22), transparent 38%),
          radial-gradient(ellipse at 88% 8%, rgba(109, 40, 217, 0.14), transparent 34%),
          linear-gradient(180deg, #0c101e 0%, #0f0f1a 50%, #0a0d18 100%);
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .shell {
        width: min(100%, 46rem);
        padding: 2rem;
        border: 1px solid rgba(124, 58, 237, 0.3);
        border-radius: 1.5rem;
        background: linear-gradient(180deg, rgba(18, 26, 47, 0.92), rgba(12, 16, 30, 0.96));
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
      }
      .eyebrow {
        display: inline-flex;
        align-items: center;
        min-height: 2rem;
        padding: 0 0.8rem;
        border: 1px solid rgba(196, 181, 253, 0.28);
        border-radius: 999px;
        background: rgba(124, 58, 237, 0.12);
        color: var(--accent-light);
        font-size: 0.76rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      h1 {
        margin: 1rem 0 0;
        max-width: 16ch;
        font-size: clamp(2rem, 5vw, 3.6rem);
        line-height: 1.03;
        letter-spacing: -0.03em;
      }
      .lead {
        margin-top: 1.2rem;
        max-width: 52ch;
        color: var(--muted);
        line-height: 1.8;
      }
      .website-note {
        margin-top: 0.9rem;
        color: var(--muted);
        line-height: 1.7;
      }
      .request-box {
        margin-top: 1.5rem;
        padding: 1rem 1.1rem;
        border: 1px solid var(--line);
        border-radius: 1rem;
        background: rgba(7, 10, 20, 0.45);
      }
      .request-box p {
        margin: 0 0 0.55rem;
        font-size: 0.9rem;
        color: var(--muted);
      }
      code {
        display: block;
        overflow-wrap: anywhere;
        font-size: 0.94rem;
        color: #e2e8f0;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
        margin-top: 1.75rem;
      }
      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 2.7rem;
        padding: 0 1rem;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 600;
      }
      .button-primary {
        background: linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #6d28d9 100%);
        color: #fff;
      }
      .button-secondary {
        border: 1px solid rgba(124, 58, 237, 0.28);
        background: rgba(18, 26, 47, 0.8);
        color: #cbd5e1;
      }
      .card {
        margin-top: 1.5rem;
        padding: 1.1rem 1.15rem;
        border: 1px solid rgba(124, 58, 237, 0.22);
        border-radius: 1rem;
        background: rgba(7, 10, 20, 0.45);
      }
      .card-title {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 600;
      }
      ul {
        margin: 0.75rem 0 0;
        padding-left: 1.15rem;
        color: var(--muted);
        line-height: 1.75;
      }
      @media (max-width: 640px) {
        .shell { padding: 1.35rem; border-radius: 1.2rem; }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <p class="eyebrow">Public Link Unavailable</p>
      <h1>This StageFlo app is currently offline.</h1>
      <p class="lead">
        The operator's computer is not connected to its public StageFlo tunnel right now.
        Ask them to reopen StageFlo or restart the public link, then try again.
      </p>
      <p class="website-note">
        If you just want the main StageFlo website, use the button below.
      </p>
      <div class="request-box">
        <p>Requested host</p>
        <code>${safeHost}</code>
        <p style="margin-top:0.85rem;">Requested path</p>
        <code>${safePath}</code>
      </div>
      <div class="actions">
        <a class="button button-primary" href="https://stageflo.app/">Visit Main Website</a>
        <a class="button button-secondary" href="javascript:window.location.reload()">Try Again</a>
      </div>
      <div class="card">
        <p class="card-title">What this usually means</p>
        <ul>
          <li>The StageFlo desktop app was closed.</li>
          <li>The internet connection dropped at the venue.</li>
          <li>The public tunnel was stopped or is reconnecting.</li>
        </ul>
      </div>
    </main>
  </body>
</html>`;
}

function offlineResponse(host, path) {
  return new Response(renderOfflinePage(host, path), {
    status: 503,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store, no-cache, must-revalidate',
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === 'stageflo.app' && url.pathname.startsWith('/offline')) {
      const requestedHost = url.searchParams.get('host') || 'stageflo.app';
      const requestedPath = url.searchParams.get('path') || '/';
      return offlineResponse(requestedHost, requestedPath);
    }

    if (url.hostname === 'stageflo.app') {
      return fetch(request);
    }

    try {
      const response = await fetch(request);
      if (!OFFLINE_STATUS_CODES.has(response.status)) {
        return response;
      }
    } catch {
      // Fall through to the offline page when the tunnel is unreachable.
    }

    return offlineResponse(url.hostname, `${url.pathname}${url.search}`);
  },
};