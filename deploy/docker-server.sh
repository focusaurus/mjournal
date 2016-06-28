#!/usr/bin/env bash
# docker based deployment for stage/production
# Usage: deploy.sh <server-hostname>"

template() {
  ./bin/render-template.js "$1" | ssh "${server_hostname}" tee "$2" > /dev/null
}

main() {
  cd "$(dirname "$0")/.." || exit 10
  source ./bin/lib/strict-mode.sh
  readonly server_hostname="$1"
  readonly app_name=$(config3 MJ_APP_NAME)
  echo "copying scripts to ${server_hostname}"
  template "./deploy/backup-db.tpl.sh" "/tmp/backup-${app_name}-db"
  template "./deploy/nginx.tpl" "/tmp/nginx_${app_name}"
  template "./deploy/compose.tpl.json" "/tmp/docker-compose-${app_name}.json"
  template "./deploy/setup-docker.tpl.sh" "/tmp/setup-docker-${app_name}.sh"
  echo 'Everything is prepared and ready to go.'
  echo 'ENTER to go live (brief downtime). CTRL-c to abort.'
  read -n 1 confirm
  echo "running docker setup script on ${server_hostname}"
  ssh -t "${server_hostname}" sudo /bin/bash "/tmp/setup-docker-${app_name}.sh"
}

main "$@"
