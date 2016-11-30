#!/usr/bin/env bash
# tag a docker image for production
# Usage $0 <image-id>

cd "$(dirname "$0")/.." || exit 10
source ./bin/lib/strict-mode.sh

PATH=$(npm bin):$PATH
readonly build="$1"
readonly registry="$(config3 MJ_DOCKER_REGISTRY)"
readonly app_name="$(config3 MJ_APP_NAME)"
readonly base="${registry}/${app_name}"
readonly version="$(config3 MJ_VERSION)"
docker tag --force=true "${build}" "${base}:v${version}"
docker tag --force=true "${build}" "${base}:production"
