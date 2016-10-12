'use strict'
const tap = require('tap')

tap.tearDown(process.exit)

const dailySummary = require('./daily-summary')

tap.test(
  'reports/daily-summary should have the correct fields and numbers',
  function (test) {
    dailySummary(function (error, result) {
      test.error(error)
      const properties = [
        'entriesCreated',
        'entriesUpdated',
        'totalEntries',
        'usersCreated',
        'totalUsers']
      properties.forEach(function (property) {
        test.equal(typeof result[property], 'number')
      })
      test.end()
    })
  })
