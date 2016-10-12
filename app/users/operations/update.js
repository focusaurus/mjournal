'use strict'

const _ = require('lodash')
const async = require('async')
const db = require('../../db')
const errors = require('httperrors')
const log = require('../../log')
const opMW = require('../../operations/middleware')
const select = require('./select')
const userSchema = require('../schemas').UPDATE

function update (run, callback) {
  const valid = userSchema.validate(run.options)
  if (valid.error) {
    setImmediate(function () {
      callback(new errors.BadRequest(valid.error.message))
    })
    return
  }
  const user = _.pick(run.options, 'email', 'theme')
  const dbOp = db('users').update(user).where({id: run.options.user.id})
  log.debug({
    user: user
  }, 'updating user')
  dbOp.exec(function (error) {
    if (error && /unique/i.test(error.message)) {
      const upError = new errors.Conflict(
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
  const run = {options: options}
  async.applyEachSeries([
    opMW.requireUser,
    update,
    select
  ], run, function (error) {
    callback(error, run.user)
  })
}

module.exports = updateUser
