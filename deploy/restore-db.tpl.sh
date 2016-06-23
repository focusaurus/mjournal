#!/usr/bin/env bash

# Please Use Google Shell Style: https://google.github.io/styleguide/shell.xml

force_disconnect() {
  cat <<EOF | docker exec --interactive "${container}" psql --user="${user}" --no-password
    revoke connect on database ${app_name} from public;
    alter database ${app_name} connection limit 0;
    select pg_terminate_backend(pid)
      from pg_stat_activity
      where pid <> pg_backend_pid()
      and datname='${app_name}';
EOF
}

restore() {
  bunzip2 --stdout "${backup_path}" \
    | docker exec --interactive "${container}" psql --user="${user}" --no-password
}

main() {
  # ---- Start unofficial bash strict mode boilerplate
  # http://redsymbol.net/articles/unofficial-bash-strict-mode/
  set -o errexit    # always exit on error
  set -o errtrace   # trap errors in functions as well
  set -o pipefail   # don't ignore exit codes when piping output
  set -o posix      # more strict failures in subshells
  # set -x          # enable debugging

  IFS="$(printf "\n\t")"
  # ---- End unofficial bash strict mode boilerplate

  app_name='{{MJ_APP_NAME}}'
  container="${app_name}_db"
  user=postgres
  backup_path="$1"
  if [[ -z "${backup_path}" ]]; then
    echo "Provide a path to a backup file" 1>&2
    exit 1
  fi
  force_disconnect
  restore
}

main "$@"
