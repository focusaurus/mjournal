_ = require "lodash"
bcrypt = require "bcrypt"
db = require "app/db"
log = require("winston").loggers.get "app:operations:users:sign-in"

run = (options, callback) ->
  denied = ->
    callback
      code: 403
      message: "Please check your email/password and try again"

  user = _.pick options, "email"
  user.email = user.email.toLowerCase()
  dbOp = db.select("users", ["id", "bcryptedPassword", "email"])
    .where(user).limit(1)
  dbOp.execute (error, result) ->
    log.debug "signIn select #{error} #{result}"
    return callback error if error
    return denied() if not result.rowCount
    row = result.rows[0]
    bcrypt.compare options.password, row.bcryptedPassword, (error, match) ->
      return callback error if error
      return denied() if not match
      user = _.pick row, "id", "email"
      return callback null, user

module.exports = run
