'use strict'

const _ = require('lodash')
const async = require('async')
const db = require('../../db')
const log = require('../../log')
const opMW = require('../../operations/middleware')

function initDbOp (run, next) {
  run.dbOp = db('entries').distinct('tags').select()
    .where('tags', '!=', '')
  next()
}

function execute (run, next) {
  log.debug({
    sql: run.dbOp.toString()
  }, 'viewTags')
  run.dbOp.exec(function (error, rows) {
    if (error) {
      log.error({
        err: error
      }, 'error in viewTags query')
      next(error)
      return
    }
    let set = _.map(rows, function (row) {
      return row.tags.split(' ')
    })
    set = _.flatten(set)
    set = _.uniq(set)
    run.result = set.map(function (tag) {
      return {text: tag}
    })
    next()
  })
}

function view (options, callback) {
  const run = {options: options}
  const stack = [
    opMW.requireUser,
    initDbOp,
    opMW.whereUser,
    execute
  ]
  async.applyEachSeries(stack, run, function (error) {
    callback(error, run.result)
  })
}

module.exports = view
