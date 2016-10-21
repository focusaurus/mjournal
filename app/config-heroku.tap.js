'use strict'
const tap = require('tap')

tap.test('DATABASE_URL parsing for heroku', (test) => {
  process.env.MJ_LOG_STREAM = 'stdout'
  process.env.DATABASE_URL =
    'postgres://usertest:passwordtest@hosttest.example.com:1234/dbtest'
  const config = require('config3')
  test.same(config.MJ_PG_DATABASE, 'dbtest')
  test.same(config.MJ_PG_USER, 'usertest')
  test.same(config.MJ_PG_PASSWORD, 'passwordtest')
  test.same(config.MJ_PG_HOST, 'hosttest.example.com')
  test.same(config.MJ_PG_PORT, 1234)
  test.same(config.MJ_PG_DATABASE, 'dbtest')
  test.end()
})

tap.tearDown(process.exit)
