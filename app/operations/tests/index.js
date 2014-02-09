var Stack = require("app/operations").Stack;
var assert = require("assert");

describe("operations middleware Stack", function() {
  it("should call a function in the stack with the args from run", function(done) {
    var stack = new Stack;
    stack.use(function(next, one, two) {
      assert.equal(typeof next, "function");
      assert.equal(one, 1);
      assert.equal(two, 2);
      next();
      done();
    });
    stack.run(1, 2);
  });
  it("should not proceed if next() is not called", function(done) {
    var stack = new Stack;
    stack.use(function(next) {
      assert.equal(typeof next, "function");
      done();
    });
    stack.use(function(next) {
      assert.fail("stack should never have invoked this middleware");
    });
    stack.run();
  });
  it("should invoke middleware with itself as this", function(done) {
    var stack = new Stack;
    stack.use(function(next) {
      this.foo = "FOO";
      next();
    });
    stack.use(function(next) {
      assert.equal(this.foo, "FOO");
      next();
      done();
    });
    stack.run();
  });
});
