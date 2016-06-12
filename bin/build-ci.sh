#!/usr/bin/env bash
# Prepare for running tests in CI

cd "$(dirname "$0")/.."
source ./bin/lib/strict-mode.sh
PATH=$(npm bin):$PATH

bower --allow-root --config.analytics=false install
ln -nsf ../app node_modules/app
./bin/build-browserify.sh
