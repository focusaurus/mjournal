#!/bin/bash
set -e
cd "$(dirname $0)/.."
readonly docker="$1"
app_name=$(./wallah/bin/get_json_value package.json name)
readonly app_name

template() {
  ./bin/render_template "$1" | ssh "${docker}" tee "$2" > /dev/null
}

echo "Starting containers on ${docker}"
template "deploy/backup-db.mustache" "/tmp/backup-${app_name}-db"
template "deploy/nginx.mustache" "/tmp/nginx_${app_name}"
template "deploy/docker_setup.sh.mustache" "/tmp/docker_setup_${app_name}.sh"
ssh -t ${docker} sudo bash "/tmp/docker_setup_${app_name}.sh"
