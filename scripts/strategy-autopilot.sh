#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AUTOPILOT_SCRIPT="$ROOT_DIR/autopilot/strategy-autopilot.mjs"

if [[ ! -f "$AUTOPILOT_SCRIPT" ]]; then
  echo "Kļūda: nav atrasts stratēģijas autopilots: $AUTOPILOT_SCRIPT" >&2
  exit 2
fi

COMMAND="${1:-today}"
if [[ $# -gt 0 ]]; then
  shift
fi

case "$COMMAND" in
  init|status|today|complete|uncomplete|log|run-daily|roadmap|goals|help)
    ;;
  *)
    echo "Nezināma komanda: $COMMAND" >&2
    echo "Lietošana: scripts/strategy-autopilot.sh [init|status|today|complete|uncomplete|log|run-daily|roadmap|goals|help] [args]" >&2
    exit 2
    ;;
esac

if [[ "$COMMAND" == "help" ]]; then
  exec node "$AUTOPILOT_SCRIPT" --help
fi

echo "RUN node autopilot/strategy-autopilot.mjs $COMMAND $*"
(cd "$ROOT_DIR" && node "$AUTOPILOT_SCRIPT" "$COMMAND" "$@")
