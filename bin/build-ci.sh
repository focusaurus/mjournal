#!/usr/bin/env bash
# Prepare for running tests in CI

cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict-mode.sh
PATH=$(npm bin):$PATH

./bin/build-elm.sh ci
