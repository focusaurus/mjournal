_ = require "lodash"
express = require "express"
createEntryOp = require "app/operations/entries/create"
needUser = require "app/middleware/need-user"

createEntry = (req, res) ->
  options = _.pick req.body, "body"
  options.user = req.user
  createEntryOp options, (error, entry) ->
    if error
      return res.status(500).send error
    res.status(201).send entry

setup = (app) ->
  app.post "/entries", needUser, express.bodyParser(), createEntry

module.exports = setup
