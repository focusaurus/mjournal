var db = require('app/db')
var paginated = require('app/operations/middleware').paginated
var test = require('tape')

var group = 'app/operations/middleware.paginated'

test(group + 'should set page 1 by default and a default limit', function (assert) {
  var run = {
    options: {},
    dbOp: db.select('example', ['id'])
  }
  var next = function () {
    var sql = run.dbOp.toString().toLowerCase()
    assert.ok(sql.indexOf("limit '50'") >= 0)
    assert.ok(sql.indexOf("offset '0'") < 0)
    assert.end()
  }
  paginated(run, next)
})

test(group + 'should set limit and offset when page is > 1', function (assert) {
  var run = {
    dbOp: db.select('example', ['id']),
    options: {
      page: '42'
    }
  }
  var next = function () {
    var sql = run.dbOp.toString().toLowerCase()
    assert.ok(sql.indexOf('limit ') >= 0)
    assert.ok(sql.indexOf('offset ') >= 0)
    assert.end()
  }
  paginated(run, next)
})
