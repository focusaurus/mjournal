var test = require('tape')
var dailySummary = require('./dailySummary')

test(
  'reports/dailySummary should have the correct fields and numbers',
  function (assert) {
  dailySummary(function (error, result) {
    assert.error(error);[
      'entriesCreated',
      'entriesUpdated',
      'totalEntries',
      'usersCreated',
      'totalUsers'].forEach(function (property) {
      assert.equal(typeof result[property], 'number')
    })
    assert.end()
  })
})
