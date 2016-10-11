'use strict'
const tap = require('tap')
const testUtils = require('../testUtils')

tap.test('app/docs GET /docs should include API docs', function (test) {
  testUtils.loadPage('/docs', function (error, dom) {
    test.error(error)
    test.ok(dom.html().indexOf('Authorization: key') >= 0)
    test.end()
  })
})

tap.tearDown(process.exit)
