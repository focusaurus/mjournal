_ = require "lodash"
db = require "app/db"
log = require("winston").loggers.get "app:operations:entries:create"

run = (options, callback) ->
  if not options.user
    return callback {code: 401, "Please sign in to view your journal"}
  dbOp = db.update("entries")
    .set(_.pick options, "body")
    .where({id: options.id})
  dbOp.execute (error, result) ->
    log.debug "entries/update #{error} #{result}"
    return callback error if error
    callback()

module.exports = run
