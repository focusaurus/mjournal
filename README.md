# mjournal

Minimalist journal aiming to be one journal for all of your technical projects. Geared toward sparse and clean UI and categorization through labels.

(grid background image stolen from http://bulletjournal.com)

# Development Prerequisites

- some docker host. Local VM recommended (Vagrant + VirtualBox)
- PostgreSQL database (Vagrant + VirtualBox recommended)

# How to build and deploy code

- do a docker build
  - `./bin/go build`
- If that succeeds, note the build ID it prints out such as `Successfully built a2452ff73a95`
- tag that for testing on stage
  - `./bin/go tag_stage <build_id_from_above>`
- restart stage with that docker image
  - `ssh dbs sudo restart mjournal`
- Test in a browser
  - `open 'http://dbs:9090'`
- If the app is working, tag for prod and push
  - This requires an SSH tunnel from your docker host to the production docker registry
  - `ssh dbs` then from dbs `ssh -N -L 5000:localhost:5000 docker.peterlyons.com`
  - on your development system, run `./bin/go tag_and_push <build_id_from_above>`
- pull the image from the prod registry to the prod docker
  - `ssh -t docker.peterlyons.com docker pull docker.peterlyons.com:5000/mjournal:production`
- restart the app in production
  - `ssh -t docker.peterlyons.com sudo restart mjournal`

# Production Deployment Setup

-
