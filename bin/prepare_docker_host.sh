#!/bin/bash
set -e
# local docker=$(echo "${DOCKER_HOST}" | cut -d / -f 3 | cut -d : -f 1)
readonly docker="$1"

./bin/render_template deploy/mjournal_db.conf.mustache | \
  ssh "${docker}" tee /tmp/mjournal_db.conf

./bin/render_template deploy/mjournal.conf.mustache | \
  ssh "${docker}" tee /tmp/mjournal.conf

ssh -t "${docker}" <<EOF
sudo mkdir -p /var/local/mjournal \
  /var/local/mjournal_db \
  /var/www/mjournal.peterlyons.com
sudo mv /tmp/mjournal.conf /tmp/mjournal_db.conf /etc/init

if [[ ! -e /var/local/mjournal/config.js ]]; then
  sudo install --group=www-data --mode=0640 /dev/null \
    /var/local/mjournal/config.js
fi
sudo initctl reload-configuration
EOF
