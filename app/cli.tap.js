'use strict'

const cli = require('./cli')
const sinon = require('sinon')
const tap = require('tap')

tap.tearDown(process.exit)

tap.test('app/cli should add a page option', (test) => {
  const mockStack = {
    command: {
      option: sinon.spy()
    }
  }
  cli.paginate(mockStack)
  test.ok(mockStack.command.option.calledWith('-p, --page <page>'))
  test.end()
})
