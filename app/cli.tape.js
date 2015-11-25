var cli = require('app/cli')
var sinon = require('sinon')
var test = require('tape')
test('app/cli should add a page option', function (assert) {
  var mockStack = {
    command: {
      option: sinon.spy()
    }
  }
  cli.paginate(mockStack)
  assert.ok(mockStack.command.option.calledWith('-p, --page <page>'))
  console.log('DEBUG CI cli.tape.js about to call assert.end()') // @bug
  assert.end()
  console.log('DEBUG CI cli.tape.js done calling assert.end()') // @bug
})
