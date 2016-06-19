#!/usr/bin/env bash
# build browser js

# This does not source ./lib/strict-mode.sh for convenience within docker

# Please Use Google Shell Style: https://google.github.io/styleguide/shell.xml
# ---- Start unofficial bash strict mode boilerplate
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -o errexit    # always exit on error
set -o errtrace   # trap errors in functions as well
set -o pipefail   # don't ignore exit codes when piping output
set -o posix      # more strict failures in subshells
# set -x          # enable debugging

IFS="$(printf "\n\t")"
# ---- End unofficial bash strict mode boilerplate

cd "$(dirname "$0")/.."

PATH=$(npm bin):$PATH
if [[ "$(config3 MJ_DEBUG_BROWSERIFY)" == "true" ]]; then
  browserify --debug -e ./app/browser.js > wwwroot/mjournal.js
else
  browserify -e ./app/browser.js \
    | uglifyjs --compress --screw-ie8 - \
    > wwwroot/mjournal.js
fi
