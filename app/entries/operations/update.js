var _ = require('lodash')
var async = require('async')
var clientFields = require('../client-fields')
var db = require('../../db')
var errors = require('httperrors')
var log = require('../../log')
var opMW = require('../../operations/middleware')
var presentEntry = require('../present-entry')

function select (where, run, next) {
  db('entries').select(clientFields)
    .where(where)
    .exec(function (error, rows) {
      run.result = presentEntry(rows && rows[0])
      next(error)
    })
}

function initDbOp (run, next) {
  run.dbOp = db('entries')
  next()
}

function execute (run, next) {
  var set = {
    updated: new Date()
  }
  var properties = ['body', 'tags']
  properties.forEach(function (property) {
    if (_.has(run.options, property)) {
      set[property] = run.options[property]
    }
  })
  if (Array.isArray(set.tags)) {
    set.tags = set.tags.join(' ')
  }
  var where = {
    id: run.options.id
  }
  run.dbOp.update(set).where(where).exec(function (error, rowCount) {
    if (error) {
      log.info({
        err: error
      }, 'error updating an entry')
      next(error)
      return
    }
    if (rowCount < 1) {
      log.info(
        {options: run.options},
        'zero rowCount on entry update (HAX0RZ?)'
      )
      next(new errors.NotFound('No entry with id ' + run.options.id))
      return
    }
    log.debug(set, 'entries/update')
    select(where, run, next)
  })
}

function update (options, callback) {
  var run = {options: options}
  async.applyEachSeries(
    [
      opMW.requireUser,
      initDbOp,
      opMW.whereUser,
      execute
    ], run, function (error) {
      callback(error, run.result)
    }
  )
}

module.exports = update
