express = require "express"

setup = (app) ->
  console.log('@bug development is running');
  app.use express.static("#{__dirname}/../../dev/component_lab")

module.exports = setup
