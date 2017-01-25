#!/usr/bin/env bash
# run node app server for development

cd "$(dirname "$0")/.." || exit 10
source ./bin/lib/strict-mode.sh
PATH=$(npm bin):$PATH

# NOTE: node-dev does not work when output is piped, so no tee
# or json formatting for you here
# node-dev --debug=9091 --inspect .

# This grep trick below took a long time to figure out
node-dev . \
  | grep --line-buffered -v '^\[INFO' \
  | tee -a logs/mjournal.log \
  | json -g -a -0 -e 'delete this.v; delete this.hostname;delete this.level; delete this.pid; delete this.name'
