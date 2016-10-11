'use strict'
const tap = require('tap')

tap.tearDown(process.exit)

const db = require('../db')
const paginated = require('./middleware').paginated

tap.test('should set page 1 by default and a default limit', (test) => {
  var run = {
    options: {},
    dbOp: db.select('example', ['id'])
  }
  function next () {
    var sql = run.dbOp.toString().toLowerCase()
    test.ok(sql.includes("limit '50'"))
    test.notOk(sql.includes("offset '0'"))
    test.end()
  }
  paginated(run, next)
})

tap.test('should set limit and offset when page is > 1', (test) => {
  var run = {
    dbOp: db.select('example', ['id']),
    options: {
      page: '42'
    }
  }
  function next () {
    var sql = run.dbOp.toString().toLowerCase()
    test.ok(sql.includes('limit '))
    test.ok(sql.includes('offset '))
    test.end()
  }
  paginated(run, next)
})
