#!/usr/bin/env bash
# deploy a docker image to the stage docker server
# Usage $0 <image-id>

cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict-mode.sh

PATH="$(npm bin):${PATH}"
readonly build="$1"
readonly tag="$(config3 MJ_DOCKER_HUB_USER)/$(config3 MJ_APP_NAME):stage"
docker tag "${build}" "${tag}"
docker push "${tag}"
export MJ_DOMAIN='stage-mj.peterlyons.com'
export MJ_ENV='stage'
export MJ_TLS_EMAIL='pete@peterlyons.com'
./deploy/docker-server.sh "${MJ_DOMAIN}"
