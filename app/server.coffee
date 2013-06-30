#!/usr/bin/env coffee
log = require("winston").loggers.get("app:server")
express = require "express"
jade = require "jade"
app = express()

app.use express.static("#{__dirname}/../build")
app.use express.cookieParser()
app.use express.session {secret: 'HkpYsNTjVpXz6BthO8hN'}
app.use (req, res, next) ->
  res.locals.user = req.user = req.session.user
  next()

#Load the controllers
require("app/controllers") app
port = process.env.MJ_EXPRESS_PORT || 9090
app.listen port, ->
  log.info "mjournal express app listening on #{port}"
