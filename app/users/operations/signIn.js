var _ = require('lodash')
var bcrypt = require('bcryptjs')
var db = require('app/db')
var errors = require('httperrors')
var log = require('app/log')
var userSchema = require('../schemas').SIGN_IN
var clientFields = require('./clientFields')

var signInFields = _.clone(clientFields)
signInFields.push('bcryptedPassword')

function signIn (options, callback) {
  var valid = userSchema.validate(options)
  if (valid.error) {
    callback(new errors.BadRequest(valid.error.message))
    return
  }
  var defaultError = new errors.Forbidden(
    'Please check your email/password and try again'
  )
  function denied (error) {
    log.debug({
      email: options.email
    }, 'user sign-in denied')
    callback(error || defaultError)
  }
  options.email = options.email.toLowerCase().trim()
  var query = db('users').select(signInFields)
    .where({
      email: options.email
    }).limit(1)
  query.exec(function (error, rows) {
    if (error) {
      callback(error)
      return
    }
    var row = rows[0]
    if (!row) {
      denied()
      return
    }
    bcrypt.compare(
      options.password, row.bcryptedPassword, function (error2, match) {
        if (error2) {
          callback(error2)
          return
        }
        if (!match) {
          denied()
          return
        }
        var user = _.pick(row, clientFields)
        callback(null, user)
      })
  })
}

module.exports = signIn
