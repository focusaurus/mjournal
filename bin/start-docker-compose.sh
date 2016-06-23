#!/usr/bin/env bash

cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict-mode.sh
PATH=$(npm bin):$PATH
./bin/render-template.js ./deploy/compose.tpl.json > docker-compose-mjournal.json
docker-compose -f docker-compose-mjournal.json up -d
