viewEntries = require "app/operations/entries/view-entries"

home = (req, res) ->
  if req.user
    viewEntries req.user, (error, entries) ->
      if error
        return res.status(500).render "error", {error}
      res.locals.entries = entries
      return res.render "home"
  else
    res.render "home"

setup = (app) ->
  app.get "/", home

module.exports = setup
