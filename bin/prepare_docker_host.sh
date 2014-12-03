#!/bin/bash
set -e
app_name="mjournal"
readonly app_name
# local docker=$(echo "${DOCKER_HOST}" | cut -d / -f 3 | cut -d : -f 1)
readonly docker="$1"

template() {
  ./bin/render_template "$1" | ssh "${docker}" tee "$2" > /dev/null
}

echo "deploying"
printf "\tapp upstart…"
template "deploy/${app_name}.conf.mustache" "/tmp/${app_name}.conf"
printf "✓\n\tdb upstart…"
template "deploy/mjournal_db.conf.mustache" "/tmp/mjournal_db.conf"
printf "✓\n\tdb backup cron job…"
template "deploy/backup-db.mustache" "/tmp/backup-${app_name}-db"
printf "✓\nmoving files into place…"

ssh  "${docker}" tee "/tmp/setup-${app_name}" <<EOF > /dev/null
sudo install --owner=root --group=adm --mode=0755 --directory \
  /var/local/${app_name} \
  /var/local/${app_name}_db \
  /var/www/${app_name}.peterlyons.com
sudo install --owner=root --group=adm --mode=0644 --target-directory=/etc/init \
  /tmp/${app_name}.conf /tmp/${app_name}_db.conf
sudo install --owner=root --group=adm --mode=0755 \
  /tmp/backup-${app_name}-db /etc/cron.daily/backup-${app_name}-db

if [[ ! -e /var/local/${app_name}/config.js ]]; then
  sudo install --group=www-data --mode=0640 /dev/null \
    /var/local/${app_name}/config.js
fi
sudo initctl reload-configuration
EOF
ssh -t ${docker} bash "/tmp/setup-${app_name}"
printf "✓\ndone\n"
