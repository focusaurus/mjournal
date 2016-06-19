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
  - docker for Mac (beta as of June 2016) recommended
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

- `./bin/test.sh`

## How to Run Code Lint

- `./bin/lint.sh`

## Docker Setup Details

** containers**

- mjournal_data
  - Data-only container storing the PostgreSQL database data files
- mjournal_db
  - Run the PostgreSQL relational database (docker image name "postgres")
  - Holds all mjournal application and session data by using the mjournal_data data volume
- mjournal
  - The mjournal node/express web application
  - Linked to mjournal_db for access to the database
  - exposes port 9090 for the HTTP API and web application

** Host OS Integration **

We integrate with the host OS (Ubuntu x64) on stage and production for the following functionality

- application configuration is specified in a CommonJS module `config.js` file
  - This is mounted into the `mjournal` container at `/etc/mjournal` and mapped to `/var/local/mjournal` on the host OS
- A cron job to run daily database backups
  - Configured in `/etc/cron.daily/backup-mjournal-db`
- nginx reverse proxy
  - Handles TLS and serving static files

## How to Run with docker-compose

- `./bin/start-docker-compose.sh`

This should get the data volume, postgres container, and node container created, linked, and running. You should be able to access the app at [http://127.0.0.1:9090]().

This is suitable for local tests that the app works under docker. It does differ from production by a few details, so it does not constitute a suitable stage or pre-production environment.

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
  - Hack `/etc/hosts` to have the production docker registry domain resolve to localhost. This is handled automatically by the `setup-docker.sh` script.
  - Use an ssh tunnel from stage to production so docker images can be transfered from stage to production. The deploy scripts will prompt you with the necessary command for this when needed.

## How to prepare a release

- get new changes in the `develop` branch committed and ready to go
- ensure your working directory is in a clean git state
- Make sure to pull down changes in `github/develop`. There normally be won't any, but for the rare pull request.
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
  - Command to run this: `docker run --detach --restart=always --publish=5000:5000 registry`
- all released docker images are tagged with semver
- docker images are also tagged by environment for "production" and "stage"

## Production Deployment Setup

- digital ocean vm: yoyo.peterlyons.com
- docker and nginx running directly on yoyo
- docker registry, postgresql, and mjournal running in docker containers

## Daily Rotating Backup System

- Backups are taken daily and monthly by way of a `cron.daily` job on the docker host
- The cron job is installed when the docker host is prepared via `./bin/deploy.sh <domain>`
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

**The MIT License (MIT)**

Copyright © 2016 Peter Lyons LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
