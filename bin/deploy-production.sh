#!/usr/bin/env bash
# deploy the docker image tagged "production" to the production server

cd "$(dirname "$0")/.." || exit 10
source ./bin/lib/strict-mode.sh

PATH="$(npm bin):${PATH}"

readonly build="$1"

if [[ -z "${build}" ]]; then
  echo "Usage: $0 <build>" 1>&2
  exit 1
fi
if [[ -z "${MJ_PG_ADMIN_PASSWORD}" || -z "${MJ_PG_PASSWORD}" ]]; then
  echo "Please set env vars MJ_PG_ADMIN_PASSWORD and MJ_PG_PASSWORD" 1>&2
  echo "These are necessary to render the docker-compose file properly" 1>&2
  exit 1
fi

readonly tag="$(config3 MJ_DOCKER_HUB_USER)/$(config3 MJ_APP_NAME):production"
docker tag "${build}" "${tag}"
docker push "${tag}"
export MJ_DOMAIN='mjournal.peterlyons.com'
export MJ_ENV='production'
export MJ_TLS_EMAIL='pete@peterlyons.com'
export NODE_ENV='production'
./deploy/docker-server.sh "${MJ_DOMAIN}"
