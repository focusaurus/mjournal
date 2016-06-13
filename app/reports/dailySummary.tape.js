var test = require('tape-catch')
var dailySummary = require('./dailySummary')

test(
  'reports/dailySummary should have the correct fields and numbers',
  function (assert) {
    dailySummary(function (error, result) {
      assert.error(error)
      var properties = [
        'entriesCreated',
        'entriesUpdated',
        'totalEntries',
        'usersCreated',
        'totalUsers']
      properties.forEach(function (property) {
        assert.equal(typeof result[property], 'number')
      })
      assert.end()
    })
  })
