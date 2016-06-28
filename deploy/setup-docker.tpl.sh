#!/usr/bin/env bash

# This file should be run as root (via sudo) on the docker host
# after pushing the correct images to the registry
# and copying the config files into /tmp

# Please Use Google Shell Style: https://google.github.io/styleguide/shell.xml

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
  echo 'DOCKER_OPTS="--icc=false --iptables=true"' > /etc/default/docker
  service docker start 2> /dev/null || true
  docker run --rm hello-world > /dev/null
  groupadd docker 2> /dev/null || true
  usermod -aG docker vagrant 2> /dev/null || true
  usermod -aG docker plyons 2> /dev/null || true
}

setup_tls() {
  local certbot='/usr/local/bin/certbot-auto'
  if [[ ! -x "${certbot}" ]]; then
    curl --silent --location --fail 'https://dl.eff.org/certbot-auto' --output "${certbot}"
    chmod +x "${certbot}"
  fi

  if [[ ! -e "/etc/letsencrypt/live/${domain}/fullchain.pem" ]]; then
    certbot-auto --non-interactive --domain "${domain}" --email "${email}" --standalone --agree-tos certonly
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

  local dhparam="/etc/nginx/sites-available/${domain}.dhparam.pem"
  if [[ ! -e "${dhparam}" ]]; then
    echo "Generating dhparam file at ${dhparam} (please wait…)"
    openssl dhparam -out "${dhparam}" 2048
  fi

  ln -nsf "../sites-available/${domain}" "/etc/nginx/sites-enabled/${domain}"
  service nginx reload > /dev/null
}

setup_cron_backups() {
  install --owner=www-data --group=staff --mode=755 --directory \
    "/var/local/${app_name}"
  install --owner=root --group=staff --mode=750 \
    "/tmp/backup-${app_name}-db" "/etc/cron.daily/backup-${app_name}-db"
}

setup_app_config() {
  local config_file="/var/local/${app_name}/config.js"
  readonly config_file

  if [[ ! -e "${config_file}" ]]; then
    install --owner=www-data --group=staff --mode=755 --directory \
      "/var/local/${app_name}"
    install --owner=www-data --group=staff --mode=0460 /dev/null "${config_file}"
    echo "Empty config installed to ${config_file}."
    echo "Edit it with secrets and redeploy"
    exit 0
  fi
  chown "www-data:staff" "${config_file}"
  chmod 0460 "${config_file}"
}

start_containers() {
  docker-compose -f "/tmp/docker-compose-${app_name}.json" up -d --no-build > /dev/null
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
  cd "$(dirname "$0")"

  app_name='{{MJ_APP_NAME}}'
  domain='{{MJ_DOMAIN}}'
  email='{{MJ_TLS_EMAIL}}'

  echo -en "setting up config/secrets file…"
  setup_app_config
  echo -en "✓\nsetting up docker…"
  setup_docker
  echo -en "✓\nsetting up tls…"
  setup_tls
  echo -en "✓\nsetting up nginx…"
  setup_nginx
  echo -en "✓\nsetting up db backups…"
  setup_cron_backups
  echo -en "✓\nsetting up containers…"
  start_containers
  echo -en "✓\n"
}

main "$@"
