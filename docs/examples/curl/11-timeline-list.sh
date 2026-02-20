#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT_DIR=$(cd "$SCRIPT_DIR/.." && pwd)
if [ -f "$ROOT_DIR/.env" ]; then
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env"
fi
: "${BASE_URL:?BASE_URL is required}"
: "${TOKEN:?TOKEN is required}"

curl -sS -G "$BASE_URL/projects/$PROJECT_ID/timeline" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  --data-urlencode "dateFrom=2026-02-01" \
  --data-urlencode "dateTo=2026-02-20" \
  --data-urlencode "type=note"
