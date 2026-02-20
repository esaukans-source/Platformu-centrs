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

curl -sS -X POST "$BASE_URL/projects/$PROJECT_ID/receipts/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -F "file=@$FILE_PATH" \
  -F "vendor=DEPO" \
  -F "receiptDate=2026-02-20"
