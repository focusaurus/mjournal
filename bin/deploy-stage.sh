#!/usr/bin/env bash
# deploy a docker image to the stage docker server
# Usage $0 <image-id>

cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict-mode.sh

PATH=$(npm bin):$PATH
readonly registry=$(config3 registry)
readonly app_name=$(config3 appName)
readonly build="$1"
# docker tag -f "${build}" "${registry}/${app_name}:stage"
./deploy/docker-server.sh mj-stage
