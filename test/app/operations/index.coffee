{Stack} = require "app/operations"
assert = require "assert"

describe "operations middleware Stack", ->
  it "should call a function in the stack with the args from run", (done) ->
    stack = new Stack
    stack.use (next, one, two) ->
      assert.equal typeof next, "function"
      assert.equal one, 1
      assert.equal two, 2
      next()
      done()
    stack.run 1, 2

  it "should not proceed if next() is not called", (done) ->
    stack = new Stack
    stack.use (next) ->
      assert.equal typeof next, "function"
      done()
    stack.use (next) ->
      assert.fail "stack should never have invoked this middleware"
    stack.run()

  it "should invoke middleware with itself as this", (done) ->
    stack = new Stack
    stack.use (next) ->
      @foo = "FOO"
      next()
    stack.use (next) ->
      assert.equal @foo, "FOO"
      next()
      done()
    stack.run()
