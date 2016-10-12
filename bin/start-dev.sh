#!/usr/bin/env bash
# run node app server for development

cd "$(dirname "$0")/.." || exit 10
source ./bin/lib/strict-mode.sh
PATH=$(npm bin):$PATH
node-dev --debug=9091 --inspect . | tee -a logs/mjournal.log
