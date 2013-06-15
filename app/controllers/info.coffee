home = (req, res) ->
  res.render "home"
setup = (app) ->
  app.get "/", home

module.exports = setup
