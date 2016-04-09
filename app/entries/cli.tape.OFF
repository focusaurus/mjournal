var cli = require('./cli')
var sinon = require('sinon')
var ware = require('ware')
var test = require('tape')

test('app/entries/cli tagsOption should add a tags option', function (assert) {
  var mockStack = {
    command: {
      option: sinon.spy()
    }
  }
  cli.tagsOption(mockStack)
  assert.ok(mockStack.command.option.calledWith('-t, --tags <tags>'))
  assert.end()
})

test('app/entries/cli bodyOption should add a body option', function (assert) {
  var mockStack = ware()
  mockStack.command = {
    option: sinon.spy()
  }
  cli.bodyOption(mockStack)
  assert.ok(mockStack.command.option.calledWith('-b, --body <body>'))
  assert.end()
})
