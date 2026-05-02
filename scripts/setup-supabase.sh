#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_env() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required environment variable: $name" >&2
    exit 1
  fi
}

require_command supabase
require_command gh
require_command jq

require_env SUPABASE_ACCESS_TOKEN
require_env SUPABASE_DB_PASSWORD

PROJECT_REF="${SUPABASE_PROJECT_REF:-}"
PROJECT_NAME="${SUPABASE_PROJECT_NAME:-stageflo-downloads}"
PROJECT_REGION="${SUPABASE_REGION:-ap-south-1}"

echo "Logging into Supabase CLI..."
supabase login --token "$SUPABASE_ACCESS_TOKEN" >/dev/null

if [[ -z "$PROJECT_REF" ]]; then
  require_env SUPABASE_ORG_ID
  echo "Creating Supabase project $PROJECT_NAME in $PROJECT_REGION..."
  create_output="$(supabase projects create "$PROJECT_NAME" \
    --org-id "$SUPABASE_ORG_ID" \
    --db-password "$SUPABASE_DB_PASSWORD" \
    --region "$PROJECT_REGION" \
    --output json)"

  PROJECT_REF="$(printf '%s' "$create_output" | jq -r '.id // .project_ref // .ref // empty')"

  if [[ -z "$PROJECT_REF" ]]; then
    PROJECT_REF="$(supabase projects list --output json | jq -r --arg name "$PROJECT_NAME" 'map(select(.name == $name)) | last | .id // .project_ref // .ref // empty')"
  fi

  if [[ -z "$PROJECT_REF" ]]; then
    echo "Failed to determine project ref after project creation." >&2
    exit 1
  fi
fi

echo "Linking local Supabase config to project $PROJECT_REF..."
supabase link --project-ref "$PROJECT_REF" -p "$SUPABASE_DB_PASSWORD"

echo "Pushing database migrations..."
supabase db push

echo "Fetching project API keys (for informational output only)..."
# SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected by Supabase into
# every Edge Function at runtime — they cannot and do not need to be set as secrets.

function_secret_args=()

if [[ -n "${RESEND_API_KEY:-}" ]]; then
  function_secret_args+=("RESEND_API_KEY=${RESEND_API_KEY}")
fi

if [[ -n "${RESEND_FROM_EMAIL:-}" ]]; then
  function_secret_args+=("RESEND_FROM_EMAIL=${RESEND_FROM_EMAIL}")
fi

if [[ -n "${ADMIN_API_KEY:-}" ]]; then
  function_secret_args+=("ADMIN_API_KEY=${ADMIN_API_KEY}")
fi

if [[ ${#function_secret_args[@]} -gt 0 ]]; then
  echo "Setting function secrets..."
  supabase secrets set --project-ref "$PROJECT_REF" "${function_secret_args[@]}"
else
  echo "No optional secrets to set (Resend/Admin key not configured — skipping)."
fi

echo "Deploying capture-download-lead Edge Function..."
supabase functions deploy capture-download-lead \
  --project-ref "$PROJECT_REF" \
  --no-verify-jwt \
  --use-api

echo "Deploying download-leads-admin Edge Function..."
supabase functions deploy download-leads-admin \
  --project-ref "$PROJECT_REF" \
  --no-verify-jwt \
  --use-api

function_url="https://${PROJECT_REF}.functions.supabase.co/capture-download-lead"

echo "Updating GitHub Pages secret NEXT_PUBLIC_SUPABASE_FUNCTION_URL..."
gh secret set NEXT_PUBLIC_SUPABASE_FUNCTION_URL \
  --repo zacstudios/stageflo.github.io \
  --body "$function_url"

echo "Supabase setup complete."
echo "Project ref: $PROJECT_REF"
echo "Function URL: $function_url"

if [[ -z "${ADMIN_API_KEY:-}" ]]; then
  echo "Note: ADMIN_API_KEY was not provided. /admin/leads will not work until you set this secret and redeploy."
fi