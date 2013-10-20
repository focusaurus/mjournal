express = require "express"
paths = require "app/paths"

setup = (app) ->
  app.use express.static("#{paths.wwwroot}")
  app.use express.static("#{paths.build}")

module.exports = setup
