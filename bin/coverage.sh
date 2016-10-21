#!/usr/bin/env bash
# run code coverage report

cd "$(dirname "$0")/.." || exit 10
source ./bin/lib/strict-mode.sh
TAP_ARGS='--coverage-report=html' ./bin/test.sh "$@"
