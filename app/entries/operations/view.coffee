db = require "app/db"
log = require "app/log"
{Stack} = require "app/operations"
opMW = require "app/operations/middleware"

initDbOp = (next) ->
  @dbOp = db.select(
    "entries", ["id", "created", "updated", "body", "tags"]).order("created")
  next()

execute = (next, options, callback) ->
  log.debug {sql: @dbOp.toString()}, "view entries"
  @dbOp.execute (error, result) ->
    if error
      log.error {err: error}, "error loading entries"
      callback error
      return
    callback null, result.rows

whereText = (next, options) ->
  textSearch = options.textSearch?.trim()
  if textSearch
    @dbOp.where(db.text('"entries"."textSearch" @@ to_tsquery($0)', [textSearch]))
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