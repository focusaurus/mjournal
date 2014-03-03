db = require "app/db"
log = require("winston").loggers.get "app:entries:operations:update"

select = (where, callback) ->
  db.select("entries").where(where).execute (error, result) ->
    callback error, result?.rows?[0]

run = (options, callback) ->
  if not options.user
    return callback {code: 401, "Please sign in to access your journal"}
  set =
    updated: new Date()
  for property in ["body", "tags"]
    if options[property]?
      set[property] = options[property]
  where =
    id: options.id
    userId: options.user.id
  db.update("entries").set(set).where(where).execute (error, result) ->
    log.debug "entries/update #{error}", result
    return callback error if error
    select where, callback

module.exports = run
