_ = require "lodash"
db = require "app/db"
log = require("winston").loggers.get "app:entries:operations:create"

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
    if error
      log.error "createEntry insert #{error} #{result}"
      callback error
      return
    callback null, result.rows[0]

module.exports = run
