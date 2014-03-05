db = require "app/db"
log = require "app/log"

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
    if error
      log.info {err: error}, "error updating an entry"
      callback error
      return
    log.debug result, "entries/update"
    select where, callback

module.exports = run
