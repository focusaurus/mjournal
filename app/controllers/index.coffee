setup = (app) ->
  app.set "view engine", "jade"
  app.set "views", "#{__dirname}/../pages"
  require("./#{controller}")(app) for controller in ["info", "styles", "users"]

module.exports = setup
