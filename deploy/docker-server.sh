#!/usr/bin/env bash
# docker based deployment for stage/production
# Usage: deploy.sh <docker-host>"

template() {
  ./bin/render-template.js "$1" | ssh "${docker}" tee "$2" > /dev/null
}

main() {
  cd "$(dirname "$0")/.." || exit 10
  source ./bin/lib/strict-mode.sh
  readonly docker="$1"
  readonly app_name=$(config3 MJ_APP_NAME)
  echo "copying scripts to ${docker}"
  template "./deploy/backup-db.mustache" "/tmp/backup-${app_name}-db"
  template "./deploy/nginx.mustache" "/tmp/nginx_${app_name}"
  template "./deploy/compose.mustache.json" "/tmp/docker-compose-${app_name}.json"
  template "./deploy/setup-docker.mustache.sh" "/tmp/setup-docker-${app_name}.sh"
  echo "running docker setup script on ${docker}"
  ssh -t "${docker}" sudo /bin/bash "/tmp/setup-docker-${app_name}.sh"
}

main "$@"
