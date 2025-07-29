#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <path-to-project-root>" >&2
  exit 1
fi

TARGET_PROJECT="${1%/}"
TARGET_LLM="$TARGET_PROJECT/llm"

if [ ! -d "$TARGET_LLM" ]; then
  echo "Creating missing $TARGET_LLM..."
  mkdir -p "$TARGET_LLM"
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Removing old prompts and scripts from $TARGET_LLM..."
rm -rf "$TARGET_LLM/prompts" "$TARGET_LLM/scripts"

echo "Copying new prompts to $TARGET_LLM/prompts..."
cp -R "$SCRIPT_DIR/../prompts" "$TARGET_LLM/prompts"

echo "Copying new scripts to $TARGET_LLM/scripts..."
cp -R "$SCRIPT_DIR" "$TARGET_LLM/scripts"

echo "Installation complete." 