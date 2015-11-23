#!/bin/bash
# lint JS code via eslint

cd "$(dirname "$0")/.."
source ./bin/lib/strict-mode.sh

PATH=$(npm bin):$PATH
printf "linting…"
eslint app bin migrations
echo ✓
