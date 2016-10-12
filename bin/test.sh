#!/usr/bin/env bash
# run automated unit tests
# Usage: test.sh [--debug]"

cd "$(dirname "$0")/.." || exit 10
source ./bin/lib/strict-mode.sh

PATH=$(npm bin):$PATH
export MJ_PG_DATABASE=mjournal_test
export MJ_LOG_STREAM=/dev/null
args=""
if [[ "${1}" == "--debug" ]]; then
  args="--timeout=0 --debug-brk=9093 --node-arg=--inspect"
  shift
fi
tests="$*"
if [[ -z "${tests}" ]]; then
  tests=$(find app -type f -name '*.tap.js' -print0 | xargs -0)
fi
echo -n "wiping test database…"
app/db/wipe.js
echo ✓
IFS=" "
tap ${args} ${tests}
