#!/bin/bash
# Prepare files for docker and CI builds

cd "$(dirname "$0")/.."
source ./bin/lib/strict-mode.sh
PATH=$(npm bin):$PATH

bower --allow-root --config.analytics=false install
ln -nsf ../app node_modules/app
./bin/build-js.sh
