var test = require('prova')
var testUtils = require('app/testUtils')

test('app/docs GET /docs should include API docs', function (assert) {
  testUtils.loadPage('/docs', function (error, dom) {
    assert.error(error)
    assert.ok(dom.html().indexOf('Authorization: key') >= 0)
    assert.end()
  })
})
