#!/usr/bin/env bash
# cross-shell wrapper that executes one or all quality gate commands defined in llm/config/gates.yaml
# Usage: ./llm/scripts/run_gates.sh <gate>
# Example: ./llm/scripts/run_gates.sh test
# Example: ./llm/scripts/run_gates.sh all  # runs all gates

set -euo pipefail

# Change to project root directory (where package.json is located)
SCRIPT_DIR="$(dirname "$0")"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")/.."
cd "$PROJECT_ROOT"

GATES_FILE="$(dirname "$0")/../config/gates.yaml"

if [[ $# -lt 1 ]]; then
  MODE="all"
else
  MODE="$1"
fi

if [[ "$MODE" == "all" ]]; then
  # Collect all gate names (keys before the colon, ignoring commented lines)
  mapfile -t ALL_GATES < <(grep -Eo '^[a-zA-Z0-9_]+:' "$GATES_FILE" | tr -d ':' )
  for g in "${ALL_GATES[@]}"; do
    echo "=== Running gate: $g ==="
    "$0" "$g" || exit $?
  done
  exit 0
fi

GATE="$MODE"

if [[ ! -f "$GATES_FILE" ]]; then
  echo "gates.yaml not found at $GATES_FILE" >&2
  exit 1
fi

# Extract command for the requested gate using grep+sed (avoids extra dependencies)
CMD=$(grep -E "^${GATE}:" "$GATES_FILE" | sed -E "s/^${GATE}:[[:space:]]*//")

if [[ -z "$CMD" ]]; then
  echo "No command configured for gate: $GATE" >&2
  exit 0
fi

# Remove surrounding quotes if present
CMD=$(echo "$CMD" | sed -E 's/^"|"$//g')

echo "Running $GATE gate: $CMD"
# shellcheck disable=SC2086
exec bash -c "$CMD" 