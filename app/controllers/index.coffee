setup = (app) ->
  app.set "view engine", "jade"
  app.set "views", "#{__dirname}/../pages"
  #Note order of controllers below matters
  controllers = [
    "users"
    "info"
    "styles"
    "entries"
  ]
  if app.get('config.development')
    controllers.push "development"
  require("./#{controller}")(app) for controller in controllers

module.exports = setup
