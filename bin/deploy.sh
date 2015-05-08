#!/bin/bash
set -e
cd "$(dirname $0)/.."
readonly docker="$1"
app_name=$(./wallah/bin/get_json_value package.json name)
readonly app_name

template() {
  ./bin/render-template.js "$1" | ssh "${docker}" tee "$2" > /dev/null
}

echo "copying scripts to ${docker}"
template "deploy/backup-db.mustache" "/tmp/backup-${app_name}-db"
template "deploy/nginx.mustache" "/tmp/nginx_${app_name}"
template "deploy/setup-docker.sh.mustache" "/tmp/setup-docker_${app_name}.sh"
echo "running docker setup script on ${docker}"
ssh -t ${docker} sudo /bin/sh "/tmp/setup-docker_${app_name}.sh"
