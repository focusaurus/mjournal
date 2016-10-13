#!/usr/bin/env bash
# lint JS code via eslint

cd "$(dirname "$0")/.."
source ./bin/lib/strict-mode.sh

PATH=$(npm bin):$PATH
printf "linting…"
eslint --format node_modules/eslint-tap/tap.js app bin migrations
echo ✓
