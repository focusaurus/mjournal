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
    viewEntriesOp options, api.sendResult.bind(null, res)
  else
    res.render "home"

createEntry = (req, res) ->
  options = _.pick req.body, "body"
  options.user = req.user
  createEntryOp options, (error, entry) ->
    if error
      return res.status(500).send error
    res.status(201).send entry

updateEntry = (req, res) ->
  options = _.pick req.body, "body"
  options.id = req.params.id
  options.user = req.user
  updateEntryOp options, (error) ->
    if error
      return res.status(500).send error
    res.status(204).send()

setup = (app) ->
  app.get "/entries", needUser, viewEntries
  app.post "/entries", needUser, bodyParser, createEntry
  app.put "/entries/:id", needUser, bodyParser, updateEntry

module.exports = setup
