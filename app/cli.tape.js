var cli = require('./cli')
var sinon = require('sinon')
var test = require('tape-catch')
test('app/cli should add a page option', function (assert) {
  var mockStack = {
    command: {
      option: sinon.spy()
    }
  }
  cli.paginate(mockStack)
  assert.ok(mockStack.command.option.calledWith('-p, --page <page>'))
  assert.end()
})
