#!/usr/bin/env bash

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

cd "$(dirname "$0")/../browser"
PATH=$(npm bin):$PATH
out="../wwwroot/mjournal.js"
api_key="../wwwroot/api-key.js"
elm-make --yes --output "${out}" MJournal.elm
elm-make --yes --output "${api_key}" ApiKey.elm
if [[ $# -eq 0 ]]; then
  # Initial interactive launch. Start fswatch
  echo Will rebuild when source code files change
  fswatch -o . | xargs -n1 "../bin/$(basename $0)"
# else
  # echo -n uglifyjs…
  # for file in "${out}" "${api_key}"
  # do
    # uglifyjs --compress "${file}" --output "${file}" 2>&1 | grep -v WARN: || true
    # uglifyjs "${file}" --output "${file}"
  # done
  # echo ✓
fi
