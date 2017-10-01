# mjournal

Minimalist journal aiming to be one journal for all of your technical projects. Geared toward sparse and clean UI and categorization through labels.

[![Build Status](https://semaphoreci.com/api/v1/projects/ada70239-ae02-4cc2-9c7c-da1652fd03f0/617307/badge.svg)](https://semaphoreci.com/focusaurus/mjournal)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

(grid background image stolen from http://bulletjournal.com)

## How to Setup for Local Development

- install the prerequisites
  - node and npm (nvm recommended)
    - see `.nvmrc` for correct version of node
  - curl (version included with OS X is fine)
  - git (homebrew recommended on OS X)
  - GNU coreutils and findutils (homebrew recommended on OS X)
- Get access to some docker host
  - docker for Mac recommended
- Get access to a PostgreSQL 9.4 database
  - Running in a docker container recommended
  - docker-compose recommended
  - See [the example docker-compose.json file below](#sample-docker-compose)
  - Run with `docker-compose -f path/to/your/docker-compose.json up -d`
- Adjust local configuration
  - `cp config.local.example.js config.local.js` and override anything from `config.default.js` you need such as `db.user`, `db.password`, etc
  - you local configuration should not get checked into the git repo and is thus ignored in the mjournal `.gitignore`

### <a name="sample-docker-compose"></a>Sample docker-compose.json file

Here is a sample of a `docker-compose.json` file you can use for local development running postgres under docker.

```json
{
  "services": {
    "postgres": {
      "container_name": "postgres",
      "environment": {
        "POSTGRES_PASSWORD": "password"
      },
      "image": "postgres",
      "ports": ["127.0.0.1:5432:5432"],
      "volumes": ["~/docker-volume/postgres:/host"]
    }
  },
  "version": "2"
}
```

## How to Run the Tests

- `npm test`

## How to Run Code Lint

- `npm run lint`

## How to run the app server directly

- `node .`
- **OR** `node-dev .`
- **OR** `./bin/start-dev.sh`
  - this one captures logs as well. RTFS for details.

## How to Run with docker-compose

- `./bin/start-docker-compose.sh`

This should get the data volume, postgres container, and node container created, linked, and running. You should be able to access the app at [http://127.0.0.1:9090]().

This is suitable for local tests that the app works under docker. It does differ from production by a few details (TLS, etc), so it does not constitute a suitable stage or pre-production environment.

## Docker Setup Details

We use the public docker registry to host our images. This vastly simplies things over trying to run our own registries.

### Containers

- **mjournal_data**
  - Data-only container storing the PostgreSQL database data files
- **mjournal_db**
  - Runs the PostgreSQL relational database (docker image name "postgres")
  - Holds all mjournal application and session data by using the mjournal_data data volume
- **mjournal**
  - The mjournal node/express web application
  - Linked to mjournal_db for access to the database
  - exposes port 9090 for the HTTP API and web application
  - configuration (secrets, etc) comes from a configuration file at `/var/local/mjournal/config.js` which is mounted in the container at `/etc/mjournal/config.js`

### Deployed Host Setup and OS Integration

When deployed on stage and production, I use an Ubuntu 14.04 x64 droplet on digital ocean, but that OS on any hosting platform should work fine. The only manual setup from a fresh droplet is ssh access:

- create your OS user (as root on droplet: `adduser plyons`)
- allow sudo with password (as root on droplet: `adduser plyons sudo`)
- Configure passwordless ssh (from your local machine: `ssh-copy-id  new-droplet-ip`)

We integrate with the host OS (Ubuntu x64) on stage and production for the following functionality

- application configuration is specified in a CommonJS module `config.js` file
  - This is mounted into the `mjournal` container at `/etc/mjournal` and mapped to `/var/local/mjournal` on the host OS
- A cron job to run daily database backups
  - Configured in `/etc/cron.daily/backup-mjournal-db`
- nginx reverse proxy
  - Handles TLS and serving static files
  - TLS certs from [letsencrypt](https://letsencrypt.org) managed by certbot-auto

### Further Notes

- Backups live at `/var/local/mjournal_db_backups` on the docker host
  - more details on backup/restore below
- all released docker images are tagged with semver
  - docker images are also tagged by environment for "production" and "stage"

## How to Prepare a Release

- get new changes in the `develop` branch committed and ready to go
- ensure your working directory is in a clean git state
- Make sure to pull down changes in `github/develop`. There normally be won't any, but for the rare pull request.
- run `./bin/release-candidate.sh <major|minor|patch>`
  - This will pull origin/master into develop
  - This will do an `npm version` to increment the version and tag the commit
- Move on to the build and test instructions below

## How to Build and Deploy Code

- do a docker build
  - `./bin/build-docker.sh`
- If that succeeds, note the container ID it prints out such as `Successfully built a2452ff73a95`
- tag and deploy that for testing on stage
  - `./bin/deploy-stage.sh <container_id_from_above>`
- If this is the first deploy to this host, the script will stop after the empty configuration file has been created
  - ssh in and edit the configuration file `/var/local/mjournal/config.js` with per-deployment values for `exports.MJ_PG_PASSWORD`. `exports.MJ_PG_ADMIN_PASSWORD` and `exports.MJ_SESSION_SECRET`
  - run the deploy script a second time
- Test in a browser
  - `open "https://stage-mj.peterlyons.com"`
- If the app is working, tag for prod and release
  - `./bin/tag-production.sh <image-id-from-docker-build>`
  - `./bin/release.sh`
- Deploy to production
  - `./bin/deploy-production.sh <image-id-from-docker-build>`

## Daily Rotating Backup System

- Backups are taken daily and monthly by way of a `cron.daily` job on the docker host
- The cron job is installed when the docker host is prepared via `./bin/deploy.sh <domain>`
- The details can be found in `deploy/backup-db.tpl.sh` but TL;DR it's basically `pg_dumpall`
- Files live as bzip-compressed SQL files at `/var/local/mjournal_db_backups` on the docker host with obvious timestamp file names
- Stale backups are pruned automatically. We retain 1 month of dailies and 3 months of monthlies

## How to Restore from Backup

- Yes, this has actually been tested on stage ;-p
- run `./bin/render-template.js ./deploy/restore-db.tpl.sh | ssh <docker_host> tee /tmp/restore.sh`
- ssh to the docker host
- run `sudo bash /tmp/restore.sh /var/local/mjournal_db_backups/<FILE_TO_RESTORE_FROM>`
  - sudo is necessary because of how postgresql requires filesystem permissions to be locked down
  - the restore file should be a `.sql.bz2` file

## License

[MIT](license.txt)
