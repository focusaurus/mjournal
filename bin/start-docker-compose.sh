#!/usr/bin/env bash

cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict-mode.sh
PATH=$(npm bin):$PATH
./bin/render-template.js ./deploy/compose.mustache.yml > docker-compose-mjournal.yml
docker-compose -f docker-compose-mjournal.yml up -d
