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
  require("./#{controller}")(app) for controller in controllers

module.exports = setup
