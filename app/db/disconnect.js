// Run this file through 'tape' last to close the db connection after tests
var test = require('prova')
var db = require('./')

test('close db connection when tests are done', function (assert) {
  db.destroy(function (error) {
    assert.error(error)
    assert.end()
    process.exit() // eslint-disable-line no-process-exit
  })
})
