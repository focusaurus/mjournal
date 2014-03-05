_ = require "lodash"
api = require "app/api"
ops = require "app/entries/operations"
express = require "express"
needUser = require "app/middleware/needUser"
bodyParser = express.bodyParser()

viewEntries = (req, res) ->
  if req.user
    options =
      user: req.user
      page: req.query.page
      textSearch: req.query.textSearch
    ops.view options, api.sendResult(res)
  else
    res.render "home"

createEntry = (req, res) ->
  options = _.pick req.body, "body", "tags"
  options.user = req.user
  ops.create options, api.sendResult(res)

updateEntry = (req, res) ->
  options = _.pick req.body, "body", "tags"
  options.id = req.params.id
  options.user = req.user
  ops.update options, api.sendResult(res)

setup = (app) ->
  app.get "/entries", needUser, viewEntries
  app.post "/entries", needUser, bodyParser, createEntry
  app.put "/entries/:id", needUser, bodyParser, updateEntry

module.exports = setup
