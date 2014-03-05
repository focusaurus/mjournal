express = require "express"
PGStore = require("connect-pg-simple")(express)
db = require "app/db"
pg = require "pg"

store = new PGStore {conString: db.dbURL, pg: pg}
setup = (app) ->
  app.use express.cookieParser()
  app.use express.session({store, secret: "izd7eT6WHsPD"})
  app.get "/sign-out", (req, res) ->
    req.session.destroy()
    res.redirect "/"

module.exports = setup
