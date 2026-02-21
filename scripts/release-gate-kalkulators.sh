#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="${1:-strict}"
AUTOPILOT_SCRIPT="$ROOT_DIR/autopilot/calculator-autopilot.mjs"
REPORT_PATH="$ROOT_DIR/autopilot/calculator-autopilot-report.json"

if [[ ! -f "$AUTOPILOT_SCRIPT" ]]; then
  echo "Kļūda: nav atrasts autopilota skripts: $AUTOPILOT_SCRIPT" >&2
  exit 2
fi

run_autopilot() {
  local args=("$@")
  echo "RUN node autopilot/calculator-autopilot.mjs ${args[*]}"
  (cd "$ROOT_DIR" && node "$AUTOPILOT_SCRIPT" "${args[@]}")
}

print_summary() {
  if [[ -f "$REPORT_PATH" ]]; then
    (cd "$ROOT_DIR" && node -e 'const r=require("./autopilot/calculator-autopilot-report.json"); const s=r.summary||{}; console.log(`Summary -> checks: ${s.totalChecks||0}, passed: ${s.passed||0}, failed: ${s.failed||0}, fixes: ${s.fixesApplied||0}`);')
  fi
}

case "$MODE" in
  quick)
    run_autopilot
    ;;
  strict)
    run_autopilot --fix
    run_autopilot
    ;;
  fix-only)
    run_autopilot --fix
    ;;
  *)
    echo "Nezināms režīms: $MODE" >&2
    echo "Lietošana: scripts/release-gate-kalkulators.sh [quick|strict|fix-only]" >&2
    exit 2
    ;;
esac

print_summary
echo "Release gate pabeigts (${MODE})."
