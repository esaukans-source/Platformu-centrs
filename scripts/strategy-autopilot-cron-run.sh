#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_FILE="$ROOT_DIR/autopilot/strategy-state.json"
LOG_DIR="$ROOT_DIR/autopilot/logs"
LOCK_FILE="$LOG_DIR/.strategy-autopilot-cron.lock"
RUN_DATE="$(date +%F)"
LOG_FILE="$LOG_DIR/strategy-autopilot-${RUN_DATE}.log"

mkdir -p "$LOG_DIR"

if command -v flock >/dev/null 2>&1; then
  exec 9>"$LOCK_FILE"
  if ! flock -n 9; then
    echo "[$(date -Is)] Already running, skip." >>"$LOG_FILE"
    exit 0
  fi
fi

{
  echo "[$(date -Is)] CRON run start (${RUN_DATE})"

  if [[ ! -f "$STATE_FILE" ]]; then
    echo "[$(date -Is)] State missing, initializing autopilot."
    (cd "$ROOT_DIR" && ./scripts/strategy-autopilot.sh init --start "$RUN_DATE")
  fi

  RUN_ARGS=(run-daily --date "$RUN_DATE")
  if [[ "${STRATEGY_AUTOPILOT_CRON_STRICT:-0}" == "1" ]]; then
    RUN_ARGS+=(--strict)
  fi

  (cd "$ROOT_DIR" && ./scripts/strategy-autopilot.sh "${RUN_ARGS[@]}")
  echo "[$(date -Is)] CRON run finished OK"
} >>"$LOG_FILE" 2>&1
