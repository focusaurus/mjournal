var test = require('prova')
var paths = require('./paths')

test('app/paths should have the expected exported strings', function (assert) {
  assert.equal(typeof paths.app, 'string')
  assert.equal(typeof paths.browser, 'string')
  assert.equal(typeof paths.build, 'string')
  assert.equal(typeof paths.thirdParty, 'string')
  assert.equal(typeof paths.wwwroot, 'string')
  assert.end()
})
