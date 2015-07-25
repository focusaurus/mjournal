var assert = require('assert')
var cli = require('./cli')
var sinon = require('sinon')
var ware = require('ware')

describe('app/entries/cli tagsOption', function () {
  it('should add a tags option', function () {
    var mockStack = {
      command: {
        option: sinon.spy()
      }
    }
    cli.tagsOption(mockStack)
    assert(mockStack.command.option.calledWith('-t, --tags <tags>'))
  })
})

describe('app/entries/cli bodyOption', function () {
  it('should add a body option', function () {
    var mockStack = ware()
    mockStack.command = {
      option: sinon.spy()
    }
    cli.bodyOption(mockStack)
    assert(mockStack.command.option.calledWith('-b, --body <body>'))
  })
})
