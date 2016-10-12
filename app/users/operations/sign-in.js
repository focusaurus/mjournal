const _ = require('lodash')
const bcrypt = require('bcryptjs')
const db = require('../../db')
const errors = require('httperrors')
const log = require('../../log')
const userSchema = require('../schemas').SIGN_IN
const clientFields = require('./client-fields')

const signInFields = _.clone(clientFields)
signInFields.push('bcryptedPassword')

function signIn (options, callback) {
  const valid = userSchema.validate(options)
  if (valid.error) {
    callback(new errors.BadRequest(valid.error.message))
    return
  }
  const defaultError = new errors.Forbidden(
    'Please check your email/password and try again'
  )
  function denied (error) {
    log.debug({
      email: options.email
    }, 'user sign-in denied')
    callback(error || defaultError)
  }
  options.email = options.email.toLowerCase().trim()
  const query = db('users').select(signInFields)
    .where({
      email: options.email
    }).limit(1)
  query.exec(function (error, rows) {
    if (error) {
      callback(error)
      return
    }
    const row = rows[0]
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
        const user = _.pick(row, clientFields)
        callback(null, user)
      })
  })
}

module.exports = signIn
