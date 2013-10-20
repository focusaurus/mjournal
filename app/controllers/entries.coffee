_ = require "lodash"
express = require "express"
createEntryOp = require "app/operations/entries/create"
updateEntryOp = require "app/operations/entries/update"
needUser = require "app/middleware/need-user"
viewEntriesOp = require "app/operations/entries/view"
api = require "app/api"
bodyParser = express.bodyParser()

viewEntries = (req, res) ->
  if req.user
    options =
      user: req.user
      page: req.query.page
    viewEntriesOp options, api.sendResult(res)
  else
    res.render "home"

createEntry = (req, res) ->
  options = _.pick req.body, "body"
  options.user = req.user
  createEntryOp options, api.sendResult(res)

updateEntry = (req, res) ->
  options = _.pick req.body, "body"
  options.id = req.params.id
  options.user = req.user
  updateEntryOp options, api.sendResult(res)

setup = (app) ->
  app.get "/entries", needUser, viewEntries
  app.post "/entries", needUser, bodyParser, createEntry
  app.put "/entries/:id", needUser, bodyParser, updateEntry

module.exports = setup
