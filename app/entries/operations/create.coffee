_ = require "lodash"
db = require "app/db"
log = require "app/log"

run = (options, callback) ->
  if not options.user
    return callback {code: 401, "Please sign in to view your journal"}
  row =
    userId: options.user.id
    body: options.body
    tags: options.tags
  returning = ["id", "created", "updated"].concat(_.keys(row))
  log.debug row, "creating new entry"
  dbOp = db.insert("entries", row).returning(returning)
  dbOp.execute (error, result) ->
    if error
      log.error {err: error},"createEntry error"
      callback error
      return
    callback null, result.rows[0]

module.exports = run
