#!/usr/bin/env bash

# This file should be run as root (via sudo) on the docker host
# after pushing the correct images to the registry
# and copying the config files into /tmp

# FYI here's the docker options we use on stage:
# DOCKER_OPTS="--ip=0.0.0.0 --host=tcp://0.0.0.0:2375 --dns=8.8.8.8 --icc=false --iptables=true --insecure-registry=docker.peterlyons.com:5000"

# Please Use Google Shell Style: https://google.github.io/styleguide/shell.xml
# Start unofficial bash strict mode boilerplate
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -o errexit    # always exit on error
set -o errtrace   # trap errors in functions as well
set -o pipefail   # don't ignore exit codes when piping output
set -o posix      # more strict failures in subshells
set -x          # enable debugging

IFS="$(printf "\n\t")"
# End unofficial bash strict mode boilerplate

setup_docker() {
  if [[ ! -x /usr/local/bin/docker-compose ]]; then
    curl --location --silent --fail "https://github.com/docker/compose/releases/download/1.7.1/docker-compose-$(uname -s)-$(uname -m)" \
      > /usr/local/bin/docker-compose \
      && chmod +x /usr/local/bin/docker-compose
  fi
  if ! dpkg -l docker-engine > /dev/null 2>&1; then
    apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
    echo 'deb https://apt.dockerproject.org/repo ubuntu-trusty main' > /etc/apt/sources.list.d/docker.list
    apt-get --quiet --quiet --yes update
    apt-get --quiet --yes purge lxc-docker
    apt-get --quiet --yes install apt-transport-https ca-certificates "linux-image-extra-$(uname -r)" apparmor docker-engine
  fi
  service docker start || true
  docker run --rm hello-world
  groupadd docker || true
  usermod -aG docker vagrant || true
  usermod -aG docker plyons || true
}

setup_tls() {
  local certbot='/usr/local/bin/certbot-auto'
  if [[ ! -x "${certbot}" ]]; then
    curl --silent --location --fail 'https://dl.eff.org/certbot-auto' --output "${certbot}"
    chmod +x "${certbot}"
  fi

  if [[ ! -e "/etc/letsencrypt/live/${domain}/fullchain.pem" ]]; then
    certbot-auto --non-interactive --domain "${domain}" --email "${email}" certonly
  fi

  local dhparam="/etc/nginx/sites-available/${domain}.dhparam.pem"
  if [[ ! -e "${dhparam}" ]]; then
    echo "Generating dhparam file at ${dhparam} (please wait…)"
    openssl dhparam -out "${dhparam}" 2048
  fi
}

setup_nginx() {
  if ! dpkg -l nginx-core > /dev/null 2>&1; then
    apt-get --quiet --yes install nginx-core
  fi
  install --owner="www-data" --group=staff --mode=755 --directory \
    "/var/www/${domain}"
  install --owner=root --group=staff --mode=750 \
    "/tmp/nginx_${app_name}" "/etc/nginx/sites-available/${domain}"
  ln -nsf "../sites-available/${domain}" "/etc/nginx/sites-enabled/${domain}"
  service nginx reload
}

setup_cron_backups() {
  echo -n "setting up cron backups…"
  install --owner=www-data --group=staff --mode=755 --directory \
    "/var/local/${app_name}"
  install --owner=root --group=staff --mode=750 \
    "/tmp/backup-${app_name}-db" "/etc/cron.daily/backup-${app_name}-db"
}

setup_app_config() {
  local config_file="/var/local/${app_name}/config.js"
  readonly config_file

  if [[ ! -e "${config_file}" ]]; then
    install --owner=www-data --group=staff --mode=0460 /dev/null "${config_file}"
    echo "Empty config installed to ${config_file}."
  fi
  chown "www-data:staff" "${config_file}"
  chmod 0460 "${config_file}"
}

# docker_clean_rm() {
#   local name="$1"
#   # This tr -d nonesense is because mustache and docker inspect
#   # both use the same {{}} (mustache) delimiter
#   set +e
#   running=$(docker inspect -f $(echo "{z{.State.Running}z}" | tr -d z) "${name}")
#   local exit_code=$?
#   set -e
#   if [ "${running}" = "true" ]; then
#     printf "✓\nstopping %s" "${name}…"
#     docker stop "${name}"
#   fi
#   if [ "${running}" = "<no value>" ]; then
#     return
#   fi
#   if [ ${exit_code} -eq 0 ]; then
#     printf "✓\nremoving %s" "${name}…"
#     docker rm "${name}"
#   fi
#   # non-zero exit code from docker inspect probably means doesn't exist
# }

start_containers() {
  docker-compose -f "/tmp/docker-compose-${app_name}.yml" up -d
}

main() {
  # Start unofficial bash strict mode boilerplate
  # http://redsymbol.net/articles/unofficial-bash-strict-mode/
  set -o errexit    # always exit on error
  set -o errtrace   # trap errors in functions as well
  set -o pipefail   # don't ignore exit codes when piping output
  set -o posix      # more strict failures in subshells
  # set -x          # enable debugging

  IFS="$(printf "\n\t")"
  # End unofficial bash strict mode boilerplate
  cd "$(dirname "$0")"

  app_name='{{appName}}'
  domain='{{domain}}'
  email='{{tlsEmail}}'

  setup_docker
  setup_tls
  setup_nginx
  setup_cron_backups
  setup_app_config
  start_containers
}

main "$@"
