'use strict'
const tap = require('tap')

tap.test('DATABASE_URL parsing for heroku', (test) => {
  process.env.MJ_LOG_STREAM = '/dev/null'
  const config = require('config3')
  test.same(typeof config.MJ_LOG_STREAM, 'object')
  test.end()
})

tap.tearDown(process.exit)
