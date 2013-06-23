home = (req, res) ->
  res.render "home", {user: req.session.user}

setup = (app) ->
  app.get "/", home

module.exports = setup
