_ = require "lodash"
bcrypt = require "bcrypt"
db = require "app/db"
log = require "app/log"

hashPassword = (cleartext, callback) ->
  bcrypt.genSalt 10, (error, salt) ->
    return callback error if error
    bcrypt.hash cleartext, salt, callback

run = (options, callback) ->
  user = _.pick options, "email"
  hashPassword options.password, (error, bcryptedPassword) ->
    return callback error if error
    user.bcryptedPassword = bcryptedPassword
    dbOp = db.insert("users", user).returning "id"
    log.debug {user}, "creating user"
    dbOp.execute (error, result) ->
      if /unique/i.test error?.message
        return callback {code: 409, message: "That email is already registered"}
      return callback error if error
      user.id = result.rows[0].id
      delete user.bcryptedPassword
      callback error, user

module.exports = run
