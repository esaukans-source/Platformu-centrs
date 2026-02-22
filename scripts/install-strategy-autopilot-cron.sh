#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNNER="$ROOT_DIR/scripts/strategy-autopilot-cron-run.sh"
LOG_DIR="$ROOT_DIR/autopilot/logs"
CRON_MARKER="# 30sek-strategy-autopilot"
ACTION="${1:-install}"
SCHEDULE="${2:-30 6 * * *}"

if [[ ! -f "$RUNNER" ]]; then
  echo "Kļūda: nav atrasts runner skripts: $RUNNER" >&2
  exit 2
fi

mkdir -p "$LOG_DIR"

CRON_COMMAND="cd \"$ROOT_DIR\" && /usr/bin/env bash \"$RUNNER\" >> \"$LOG_DIR/cron-launcher.log\" 2>&1"
CRON_ENTRY="${SCHEDULE} ${CRON_COMMAND} ${CRON_MARKER}"

current_cron="$(crontab -l 2>/dev/null || true)"
cleaned_cron="$(printf "%s\n" "$current_cron" | sed "/30sek-strategy-autopilot/d" | sed '/^[[:space:]]*$/N;/^\n$/D')"

install_cron() {
  local merged
  if [[ -n "$cleaned_cron" ]]; then
    merged="${cleaned_cron}"$'\n'"${CRON_ENTRY}"
  else
    merged="${CRON_ENTRY}"
  fi
  printf "%s\n" "$merged" | crontab -
  echo "Cron uzstādīts."
  echo "Grafiks: $SCHEDULE"
}

uninstall_cron() {
  if [[ -n "$cleaned_cron" ]]; then
    printf "%s\n" "$cleaned_cron" | crontab -
  else
    crontab -r 2>/dev/null || true
  fi
  echo "Cron ieraksts noņemts."
}

status_cron() {
  local matches
  matches="$(crontab -l 2>/dev/null | grep '30sek-strategy-autopilot' || true)"
  if [[ -z "$matches" ]]; then
    echo "Cron nav uzstādīts."
    exit 1
  fi
  echo "Cron ir uzstādīts:"
  echo "$matches"
}

run_once() {
  echo "Palaižu vienreizēju cron runneri..."
  /usr/bin/env bash "$RUNNER"
  echo "Done."
}

case "$ACTION" in
  install)
    install_cron
    ;;
  uninstall)
    uninstall_cron
    ;;
  reinstall)
    uninstall_cron
    install_cron
    ;;
  status)
    status_cron
    ;;
  once)
    run_once
    ;;
  *)
    echo "Lietošana: scripts/install-strategy-autopilot-cron.sh [install|uninstall|reinstall|status|once] [\"M H * * *\"]" >&2
    exit 2
    ;;
esac
