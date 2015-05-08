# mjournal

Minimalist journal aiming to be one journal for all of your technical projects. Geared toward sparse and clean UI and categorization through labels.

(grid background image stolen from http://bulletjournal.com)

![Build Status](https://api.travis-ci.org/focusaurus/mjournal.svg)
# Development Prerequisites

- git
- curl
- some docker host. Local VM recommended (Vagrant + VirtualBox)
- PostgreSQL database (Vagrant + VirtualBox recommended)

# How to prepare a release

- get new changes in the `develop` branch committed and ready to go
- ensure your working directory is in a clean git state
- run `./bin/go release_candidate <major|minor|patch>`
  - This will pull origin/master into develop
  - This will do an `npm version` to increment the version and tag the commit
- Move on to the build and test instructions below

# How to build and deploy code

- do a docker build
  - `./bin/go build "v$(config3 pack.version)"`
- If that succeeds, note the build ID it prints out such as `Successfully built a2452ff73a95`
- tag and deploy that for testing on stage
  - `./bin/go stage <build_id_from_above>`
- Test in a browser
  - `open 'http://dbs:9090'`
- If the app is working, tag for prod
  - `go tag_production <build_id_from_above>`
- Deploy to production
  - `go production`
  - Note this requires an ssh tunnel from dbs to prod. It will prompt you with the command to establish that in another terminal

# Docker Setup

- Use public postgres docker image
  - container running with name `mjournal_db`
  - data lives in `/var/local/mjournal_db` on the docker host
  - volumes used to mount that into the container for both DB data and logs
  - Backups live at `/var/local/mjournal_db_backups` on the docker host
    - more details on backup/restore below
- mjournal node/express app runs in a container linked to the db container
  - data lives in `/var/local/mjournal` for logs and configuration
  - production configuration lives in `/var/local/mjournal/config.js`
- running a local/private docker registry in prod at `docker.peterlyons.com:5000`
- all released docker images are tagged with semver
- docker images are also tagged by environment for "production" and "stage"

# Production Deployment Setup

- digital ocean vm: yoyo.peterlyons.com
- docker and nginx running directly on yoyo
- postgresql and mjournal running in docker containers

# Daily Rotating Backup System

- Backups are taken daily and monthly by way of a `cron.daily` job on the docker host
- The cron job is installed when the docker host is prepared via `./bin/deploy.sh <hostname>`
- The details can be found in `deploy/backup-db.mustache` but TL;DR it's basically `pg_dumpall`
- Files live as bzip-compressed SQL files at `/var/local/mjournal_db_backups` on the docker host with obvious timestamp file names
- Stale backups are pruned automatically. We retain 1 month of dailies and 3 months of monthlies

# How to restore from backup

- Yes, this has actually been tested on stage ;-p
- run `./bin/render-template.js ./deploy/restore-db.mustache | ssh <docker_host> tee /tmp/restore.sh`
- ssh to the docker host
- run `sudo bash /tmp/restore.sh /var/local/mjournal_db_backups/<FILE_TO_RESTORE_FROM>`
  - sudo is necessary because of how postgresql requires filesystem permissions to be locked down
  - the restore file should be a `.sql.bz2` file

# License

Copyright 2015 Peter Lyons LLC
