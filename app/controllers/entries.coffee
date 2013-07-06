_ = require "lodash"
express = require "express"
createEntryOp = require "app/operations/entries/create"
updateEntryOp = require "app/operations/entries/update"
needUser = require "app/middleware/need-user"

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
  app.post "/entries", needUser, express.bodyParser(), createEntry
  app.put "/entries/:id", needUser, express.bodyParser(), updateEntry

module.exports = setup
