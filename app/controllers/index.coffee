setup = (app) ->
  app.set "view engine", "jade"
  app.set "views", "#{__dirname}/../pages"
  #Note order of controllers below matters
  controllers = [
    "scripts" #needs to be before static
    "static"
    "users"
    "styles"
    "entries"
  ]
  if app.get "config.development"
    controllers.push "development"
  require("./#{controller}")(app) for controller in controllers

module.exports = setup
