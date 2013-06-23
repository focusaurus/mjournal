_ = require "lodash"
express = require "express"
signInOp = require "app/operations/users/sign-in"

signIn = (req, res) ->
  options = _.pick req.body, "email", "password"
  signInOp options, (error, user) ->
    if error
      return res.render "home", {error: error}
    req.session.user = user
    res.redirect "/"

signOut = (req, res) ->
  req.session.destroy()
  res.redirect "/"

setup = (app) ->
  app.post "/users/sign-in", express.bodyParser(), signIn
  # app.post "/users/sign-up", express.bodyParser(), signUp
  app.get "/users/sign-out", signOut

module.exports = setup
