var _ = require('lodash')
var async = require('async')
var db = require('../../db')
var errors = require('httperrors')
var log = require('../../log')
var opMW = require('../../operations/middleware')
var select = require('./select')
var userSchema = require('../schemas').UPDATE

function update (run, callback) {
  var valid = userSchema.validate(run.options)
  if (valid.error) {
    setImmediate(function () {
      callback(new errors.BadRequest(valid.error.message))
    })
    return
  }
  var user = _.pick(run.options, 'email', 'theme')
  var dbOp = db('users').update(user).where({id: run.options.user.id})
  log.debug({
    user: user
  }, 'updating user')
  dbOp.exec(function (error) {
    if (error && /unique/i.test(error.message)) {
      var upError = new errors.Conflict(
        'That email belongs to another account')
      callback(upError)
      return
    }
    if (error) {
      callback(error)
      return
    }
    callback()
  })
}

function updateUser (options, callback) {
  var run = {options: options}
  async.applyEachSeries([
    opMW.requireUser,
    update,
    select
  ], run, function (error) {
    callback(error, run.user)
  })
}

module.exports = updateUser
