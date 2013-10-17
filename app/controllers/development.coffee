express = require "express"

setup = (app) ->
  app.use express.static("#{__dirname}/../../dev/component_lab")

module.exports = setup
