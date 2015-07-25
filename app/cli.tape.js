var sinon = require('sinon')
var cli = require('app/cli')
var test = require('tape')

test('app/cli should add a page option', function (assert) {
  var mockStack = {
    command: {
      option: sinon.spy()
    }
  }
  cli.paginate(mockStack)
  assert.plan(1)
  assert.true(mockStack.command.option.calledWith('-p, --page <page>'))
  assert.end()
})
