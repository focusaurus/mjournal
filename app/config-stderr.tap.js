'use strict'
const tap = require('tap')

tap.test('DATABASE_URL parsing for heroku', (test) => {
  process.env.MJ_LOG_STREAM = 'stderr'
  const config = require('config3')
  test.equal(config.MJ_LOG_STREAM, process.stderr)
  test.end()
})

tap.tearDown(process.exit)
