#!/usr/bin/env bash
# build and watch JS for local development

cd "$(dirname "$0")/.."
source ./bin/lib/strict-mode.sh

PATH=$(npm bin):$PATH
watchify --debug -o wwwroot/mjournal.js -e app/browser.js
