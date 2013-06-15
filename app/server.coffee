#!/usr/bin/env coffee
log = require("winston").loggers.get("app:server")
express = require "express"
jade = require "jade"
app = express()

#Load the controllers
require("app/controllers") app
port = process.env.MJ_EXPRESS_PORT || 9090
app.listen port, ->
  log.info "mjournal express app listening on #{port}"
