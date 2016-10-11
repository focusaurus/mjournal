'use strict'
// DB connections and express server keep process running
// This forces an exit
const tap = require('tap')

tap.tearDown(process.exit)
tap.test((test) => {
  test.pass('tap-exit ran')
  test.end()
})

module.exports = process.exit
