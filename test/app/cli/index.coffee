sinon = require "sinon"
assert = require "assert"
cli = require "app/cli"

describe "app/cli", ->
  it "should add a page option", ->
    mockStack =
      command:
        option: sinon.spy()
    cli.paginate mockStack
    assert mockStack.command.option.calledWith "--page,-p <page>"
