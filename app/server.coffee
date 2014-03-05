#!/usr/bin/env coffee
express = require "express"
log = require "app/log"
app = express()

if (process.env.NODE_ENV or "development") is "development"
  app.set "config.development", true

#Load the controllers
require("app/controllers") app

port = process.env.MJ_EXPRESS_PORT or 9090
app.listen port, (error) ->
  if error
    log.fatal "Unable to bind network socket. Exiting", {err: error}
    process.exit 10
  log.info {port}, "mjournal express app listening"
