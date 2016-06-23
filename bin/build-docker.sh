#!/usr/bin/env bash
# build the docker image for this app
cd "$(dirname "$0")/.."
source ./bin/lib/strict-mode.sh

./bin/render-template.js deploy/Dockerfile.tpl > Dockerfile
exec docker build --tag=mjournal .
