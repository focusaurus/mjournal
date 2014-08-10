var assert = require("assert");
var expect = require("expectacle");
var Stack = require("app/operations/Stack");

describe("operations middleware Stack", function() {
  it("should pass a clean runState instance for each run", function(done) {
    var stack = new Stack();
    stack.use(function(next, run) {
      expect(next).toBeFunction();
      expect(run).toBeObject();
      expect(run.options).toBeObject();
      expect(run.options.foo).toBe("FOO");
      run.localState = "Idaho";
      next();
    });
    stack.use(function(next, run) {
      expect(next).toBeFunction();
      expect(run).toBeObject();
      expect(run.localState).toBe("Idaho");
      next();
      done();
    });
    stack.run({foo: "FOO"});
  });
  it("should not proceed if next() is not called", function(done) {
    var stack = new Stack();
    stack.use(function(next) {
      expect(next).toBeFunction();
      done();
    });
    stack.use(function() {
      assert(false, "stack should never have invoked this middleware");
    });
    stack.run();
  });
  it("should invoke middleware with itself as this", function(done) {
    var stack = new Stack();
    stack.use(function(next) {
      this.foo = "FOO";
      next();
    });
    stack.use(function(next) {
      expect(this).toHaveProperty("foo");
      expect(this.foo).toBe("FOO");
      next();
      done();
    });
    stack.run();
  });
  it("should support multiple invocations", function() {
    var stack = new Stack();
    stack.use(function(next) {
      this.runCount = (this.runCount || 0) + 1;
      next();
    });
    expect(stack).not.toHaveProperty("runCount");
    stack.run();
    expect(stack).toHaveProperty("runCount");
    expect(stack.runCount).toBe(1);
    stack.run();
    expect(stack).toHaveProperty("runCount");
    expect(stack.runCount).toBe(2);
  });
});
