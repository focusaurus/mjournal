#!/bin/bash
# run automated unit tests
# Usage: test.sh [--debug]"

cd "$(dirname "$0")/.."
source ./bin/lib/strict-mode.sh

PATH=$(npm bin):$PATH
export NODE_ENV=test
args=""
if [[ "${1}" == "--debug" ]]; then
  args="${args} --debug-brk=9093"
  shift
fi
tests="$@"
if [[ -z "${tests}" ]]; then
  tests=$(find app -type f -name '*.tape.js' | xargs)
fi
echo -n "wiping test database…"
app/db/wipe.js
echo ✓
IFS=" "
prova --progress ${args} ${tests} ./app/db/disconnect.js
./bin/lint.sh
