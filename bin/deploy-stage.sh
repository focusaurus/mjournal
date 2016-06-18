#!/usr/bin/env bash
# deploy a docker image to the stage docker server
# Usage $0 <image-id>

cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict-mode.sh

PATH=$(npm bin):$PATH
readonly build="$1"
readonly tag="$(config3 dockerHubUsername)/$(config3 appName):stage"
docker tag "${build}" "${tag}"
docker push "${tag}"
export DOMAIN='stage-mj.peterlyons.com'
export TLS_EMAIL='pete@peterlyons.com'
./deploy/docker-server.sh "${DOMAIN}"
