#!/usr/bin/env bash
# build browser js
# This does not source ./lib/strict-mode.sh for convenience within docker
set -o errexit    # always exit on error
set -o errtrace   # trap errors in functions as well
set -o pipefail   # don't ignore exit codes when piping output
set -o posix      # more strict failures in subshells
# set -x          # enable debugging

IFS="$(printf "\n\t")"
cd "$(dirname "$0")/.."

PATH=$(npm bin):$PATH
browserify -e ./app/browser.js | uglifyjs --compress --screw-ie8 - > wwwroot/mjournal.js
