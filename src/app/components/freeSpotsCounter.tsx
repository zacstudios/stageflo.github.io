"use client";

import { useEffect, useState } from "react";

type SpotsData = {
  claimed: number;
  total: number;
  remaining: number;
  soldOut: boolean;
};

function getEndpointUrl() {
  const explicit = process.env.NEXT_PUBLIC_FREE_SPOTS_ENDPOINT?.trim() ?? "";
  if (explicit) return explicit;

  // NEXT_PUBLIC_SUPABASE_FUNCTION_URL may be the full capture-download-lead
  // endpoint (see scripts/setup-supabase.sh), so derive from the host origin.
  const base = process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL?.trim() ?? "";
  if (!base || !base.includes(".functions.supabase.co")) return "";

  try {
    return `${new URL(base).origin}/free-spots-count`;
  } catch {
    return "";
  }
}

const ENDPOINT_URL = getEndpointUrl();
const FETCH_TIMEOUT_MS = 8000;
const FALLBACK_COPY = "Free forever for the first 100 churches — early adopters keep it free for life.";

export default function FreeSpotsCounter() {
  const [spots, setSpots] = useState<SpotsData | null>(null);

  useEffect(() => {
    if (!ENDPOINT_URL) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    (async () => {
      try {
        const response = await fetch(ENDPOINT_URL, { signal: controller.signal });
        if (!response.ok) return;
        const data = await response.json();
        if (
          typeof data?.claimed === "number" &&
          typeof data?.total === "number" &&
          typeof data?.remaining === "number"
        ) {
          setSpots({
            claimed: data.claimed,
            total: data.total,
            remaining: data.remaining,
            soldOut: Boolean(data.soldOut),
          });
        }
      } catch {
        // Keep the static fallback copy on any failure.
      } finally {
        window.clearTimeout(timeoutId);
      }
    })();

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  let copy = FALLBACK_COPY;
  if (spots) {
    copy = spots.soldOut
      ? "All 100 free-forever spots are claimed. Paid plans coming soon."
      : `${spots.claimed} of ${spots.total} free-forever spots claimed — ${spots.remaining} left.`;
  }

  return (
    <p className="free-spots-counter" aria-live="polite">
      {copy}
    </p>
  );
}
