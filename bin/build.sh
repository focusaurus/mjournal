#!/bin/bash
set -o errexit    # always exit on error
set -o errtrace   # trap errors in functions as well
set -o pipefail   # don"t ignore exit codes when piping output
set -o posix      # more strict failures in subshells
# set -x          # enable debugging
cd "$(dirname "$0")/.."
IFS="$(printf "\n\t")"
./node_modules/.bin/bower --allow-root --config.analytics=false install
ln -nsf ../app node_modules/app
./bin/build-js.sh
