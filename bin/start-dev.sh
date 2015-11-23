#!/bin/bash
# run node app server for development

cd "$(dirname "$0")/.."
source ./bin/lib/strict-mode.sh
PATH=$(npm bin):$PATH
node-dev --debug=9091 app/server | tee -a logs/mjournal.log | bistre
