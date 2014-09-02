#!/bin/bash
set -e
# local docker=$(echo "${DOCKER_HOST}" | cut -d / -f 3 | cut -d : -f 1)
readonly docker="$1"
ssh -t "${docker}" sudo mkdir -p /var/local/mjournal /var/local/mjournal_db /var/www/mjournal.peterlyons.com
./bin/render_template deploy/mjournal_db.conf.mustache | \
  ssh "${docker}" tee /tmp/mjournal_db.conf
./bin/render_template deploy/mjournal.conf.mustache | \
  ssh "${docker}" tee /tmp/mjournal.conf
ssh -t "${docker}" sudo mv /tmp/mjournal.conf /tmp/mjournal_db.conf /etc/init
ssh -t "${docker}" sudo initctl reload-configuration
