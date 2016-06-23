#!/usr/bin/env bash
# Install this script as root:sudo 0750 in /etc/cron.daily/backup-{{MJ_APP_NAME}}-db
# sudo install --owner=root --group=sudo --mode=0750 \
#   /tmp/backup-{{MJ_APP_NAME}}-db /etc/cron.daily/backup-{{MJ_APP_NAME}}-db
if [[ ! -e /var/run/docker.sock ]]; then
  export DOCKER_HOST=tcp://localhost:2375
fi
container="{{MJ_APP_NAME}}_db"
user=postgres
backup_dir="/var/local/{{MJ_APP_NAME}}_db_backups"

do_backup() {
  docker exec "${container}" \
    pg_dumpall --clean --user="${user}" --no-password > "$1"
  # use -f and not --force here for busybox/boot2docker compatibility
  bzip2 -f "$1"
  chown root:sudo "$1.bz2"
  chmod 440 "$1.bz2"
}

prepare() {
  export DATE=$(date +%Y-%m-%d)
  install -d --owner=root --group=sudo --mode=0750 "${backup_dir}"
}

choose_backups() {
  # date +%d: Date of the Month e.g. 27
  if [[ $(date +%d) == "01" ]]; then
    export MONTHLY=yes
  fi
}

backup_daily() {
  # echo "Taking daily backup"
  do_backup "${backup_dir}/${DATE}.daily.sql"
}

backup_monthly() {
  if [[ -z "${MONTHLY}" ]]; then
    return 0
  fi
  # echo "Taking monthly backup"
  do_backup "${backup_dir}/$DATE.monthly.sql"
}

delete_stale_backups() {
  # Use -mtime here instead of -ctime for busybox/boot2docker compatibility
  find "${backup_dir}" -name '*.daily.sql.bz2' -mtime +30 -delete
  find "${backup_dir}" -name '*.monthly.sql.bz2' -mtime +90 -delete
}

main() {
  prepare
  choose_backups
  backup_daily
  backup_monthly
  delete_stale_backups
}

main "$@"
