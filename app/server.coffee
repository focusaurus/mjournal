#!/usr/bin/env coffee
express = require "express"
log = require("winston").loggers.get("app:server")
paths = require "app/paths"
app = express()

if (process.env.NODE_ENV or "development") is "development"
  app.set "config.development", true

app.use express.static("#{paths.wwwroot}")
app.use express.static("#{paths.build}")

#Load the controllers
require("app/controllers") app

port = process.env.MJ_EXPRESS_PORT or 9090
app.listen port, ->
  log.info "mjournal express app listening on #{port}"
