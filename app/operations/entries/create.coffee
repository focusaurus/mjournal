_ = require "lodash"
db = require "app/db"
log = require("winston").loggers.get "app:operations:entries:create"

run = (options, callback) ->
  if not options.user
    return callback {code: 401, "Please sign in to view your journal"}
  row =
    userId: options.user.id
    body: options.body
  dbOp = db.insert("entries", ["userId", "body"])
    .addRow(row)
    .returning(["id", "body", "created", "updated"])
  dbOp.execute (error, result) ->
    log.debug "createEntry insert #{error} #{result}"
    return callback error if error
    callback null, result.rows[0]

module.exports = run
