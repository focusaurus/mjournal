setup = (app) ->
  app.set "view engine", "jade"
  app.set "views", "#{__dirname}/../pages"
  app.router #access router to bypass magic insertion
  #Note order of controllers below matters
  controllers = [
    "scripts" #needs to be before static
    "styles"
    "static"
    "../users/controller"
    "../entries/controller"
  ]
  require("./#{controller}")(app) for controller in controllers
  app.use app.router
module.exports = setup
