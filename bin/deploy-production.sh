#!/bin/bash
# deploy the docker image tagged "production" to the production server

cd "$(dirname "$0")/.."
source ./bin/lib/strict-mode.sh

PATH=$(npm bin):$PATH

if [[ -z "${DOCKER_IP}" ]]; then
  echo "DOCKER_IP env var not set, run 'dme' to set it" 1>&2
  exit 1
fi
readonly registry="$(config3 registry)"
readonly app_name="$(config3 appName)"
readonly base="${registry}/${app_name}"
readonly version="$(config3 appVersion)"
readonly hostname="$(NODE_ENV=production config3 hostname)"
echo "OK, in another terminal, connect the ssh tunnel:"
echo "ssh -t ${DOCKER_IP} ssh -N -L 5000:localhost:5000 ${USER}@yoyo.peterlyons.com"
echo "ENTER to continue when tunnel is up, CTRL-c to abort"
read -n 1 confirm
docker push "${base}:v${version}"
docker push "${base}:production"
ssh "${hostname}" \
  env DOCKER_HOST=tcp://localhost:2375 docker pull "${base}:v${version}"
ssh "${hostname}" \
  env DOCKER_HOST=tcp://localhost:2375 docker pull "${base}:production"
echo "Everything is prepared and ready to go."
echo "ENTER to go live (brief downtime). CTRL-c to abort."
read -n 1 confirm
NODE_ENV=production ./deploy/docker-server.sh "${hostname}"
