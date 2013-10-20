paths = require "app/paths"
coffeescript = require "connect-coffee-script"

setup = (app) ->
  app.use coffeescript
    src: "#{paths.app}/browser"
    dest: "#{paths.build}"

module.exports = setup
