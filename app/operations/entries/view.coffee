_ = require "lodash"
db = require "app/db"
log = require("winston").loggers.get "app:operations:entries:view-entries"

run = (user, callback) ->
  if not user
    return callback {code: 401, "Please sign in to view your journal"}
  filter = {userId: user.id}
  dbOp = db.select("entries", ["id", "created", "updated", "body"])
    .where(filter).order('created').limit(50)
  dbOp.execute (error, result) ->
    log.debug "viewEntries select #{error} #{result.rowCount}"
    return callback error if error
    callback null, result.rows

module.exports = run
