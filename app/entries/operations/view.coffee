db = require "app/db"
log = require("winston").loggers.get "app:entries:operations:view"
{Stack} = require "app/operations"
opMW = require "app/operations/middleware"

initDbOp = (next) ->
  @dbOp = db.select(
    "entries", ["id", "created", "updated", "body"]).order("created")
  next()

execute = (next, options, callback) ->
  @dbOp.execute (error, result) ->
    log.debug "select #{error} #{result.rowCount}"
    return callback error if error
    callback null, result.rows

whereText = (next, options) ->
  if options.q?
    @dbOp.where(db.text("body @@ $0", [options.q]))
  next()

runStack = ->
  stack = new Stack
  stack.use initDbOp
  stack.use opMW.requireUser
  stack.use opMW.whereUser
  stack.use whereText
  stack.use opMW.paginated
  stack.use execute
  stack.run arguments...

module.exports = runStack
