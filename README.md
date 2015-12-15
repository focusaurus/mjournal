# mjournal

Minimalist journal aiming to be one journal for all of your technical projects. Geared toward sparse and clean UI and categorization through labels.

CI Tests - develop branch - [![Build Status](https://semaphoreci.com/api/v1/projects/ada70239-ae02-4cc2-9c7c-da1652fd03f0/617307/badge.svg)](https://semaphoreci.com/focusaurus/mjournal)

(grid background image stolen from http://bulletjournal.com)

## How to Setup For Local Development

- install the prerequisites
  - node and npm (nvm recommended)
    - see `package.json` `engines.node` field for correct version
  - git
  - curl
  - GNU coreutils and findutils (homebrew recommended on OSX)
- Get access to some docker host
  - docker-machine recommended
- Get access to a PostgreSQL 9.4 database
  - Running in a docker container recommended
- Adjust local configuration
  - `cp config.local.example.js config.local.js` and override anything from `config.default.js` you need such as `db.user`, `db.password`, etc
  - you local configuration should not get checked into the git repo and is thus matched by the `.gitignore`

## Local Stage Deployment Setup

- I use a local docker-machine setup to act as my staging server
- After a `docker-machine create` command has created your docker host, make sure you have ssh access set up
  - I do this with a section such as this in my `~/.ssh/config`

```
##### docker-machine #####
Host 192.168.99.*
  User docker
  IdentityFile ~/.docker/machine/machines/default/id_rsa
```

- As long as you can ssh into your docker host as a user with sudo permissions, that should work
- Stage shares the single production docker registry, but uses an ssh tunnel for authentication as the production docker registry is not accessible from the Internet
- To make this work requires 2 key bits:
  - Hack `/etc/hosts` to have the production docker registry hostname resolve to localhost. This is handled automatically by the `setup-docker.sh` script.
  - Use an ssh tunnel from stage to production so docker images can be transfered from stage to production. The deploy scripts will prompt you with the necessary command for this when needed.

## How to prepare a release

- get new changes in the `develop` branch committed and ready to go
- ensure your working directory is in a clean git state
- Make sure to pull down changes in `github/develop` from automated greenkeeper pull requests for dependency updates
- run `./bin/release-candidate.sh <major|minor|patch>`
  - This will pull origin/master into develop
  - This will do an `npm version` to increment the version and tag the commit
- Move on to the build and test instructions below

## How to build and deploy code

- do a docker build
  - `./bin/build-docker.sh`
- If that succeeds, note the container ID it prints out such as `Successfully built a2452ff73a95`
- tag and deploy that for testing on stage
  - `./bin/deploy-stage.sh <container_id_from_above>`
- Test in a browser
  - `open "http://${DOCKER_IP}:9090"`
- If the app is working, tag for prod and release
  - `./bin/tag-production.sh <container_id_from_above>`
  - `./bin/release.sh`
- Deploy to production
  - `./bin/deploy-production.sh`
  - Note this requires an ssh tunnel from dbs to prod. It will prompt you with the command to establish that in another terminal

## Docker Setup

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

## Production Deployment Setup

- digital ocean vm: yoyo.peterlyons.com
- docker and nginx running directly on yoyo
- postgresql and mjournal running in docker containers

## Daily Rotating Backup System

- Backups are taken daily and monthly by way of a `cron.daily` job on the docker host
- The cron job is installed when the docker host is prepared via `./bin/deploy.sh <hostname>`
- The details can be found in `deploy/backup-db.mustache` but TL;DR it's basically `pg_dumpall`
- Files live as bzip-compressed SQL files at `/var/local/mjournal_db_backups` on the docker host with obvious timestamp file names
- Stale backups are pruned automatically. We retain 1 month of dailies and 3 months of monthlies

## How to restore from backup

- Yes, this has actually been tested on stage ;-p
- run `./bin/render-template.js ./deploy/restore-db.mustache | ssh <docker_host> tee /tmp/restore.sh`
- ssh to the docker host
- run `sudo bash /tmp/restore.sh /var/local/mjournal_db_backups/<FILE_TO_RESTORE_FROM>`
  - sudo is necessary because of how postgresql requires filesystem permissions to be locked down
  - the restore file should be a `.sql.bz2` file

## License

Copyright 2015 Peter Lyons LLC
