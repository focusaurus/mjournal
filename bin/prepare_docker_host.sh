#!/bin/bash
set -e
cd "$(dirname $0)/.."
readonly docker="$1"

template() {
  ./bin/render_template "$1" | ssh "${docker}" tee "$2" > /dev/null
}

echo "Starting containers on ${docker}"
template "deploy/docker_setup.sh.mustache" "/tmp/docker_setup.sh"
ssh -t ${docker} sudo bash "/tmp/docker_setup.sh"
