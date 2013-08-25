#!/usr/bin/env coffee
log = require("winston").loggers.get("app:server")
express = require "express"
app = express()

if (process.env.NODE_ENV or "development") is "development"
  app.set "config.development", true

app.use express.static("#{__dirname}/../build")

#Load the controllers
require("app/controllers") app

port = process.env.MJ_EXPRESS_PORT or 9090
app.listen port, ->
  log.info "mjournal express app listening on #{port}"
