var Stack = require("app/operations/Stack");
var expect = require("expectacle");

describe("operations middleware Stack", function() {
  it("should call a function in the stack with the args from run", function(done) {
    var stack = new Stack();
    stack.use(function(next, one, two) {
      expect(next).toBeFunction();
      expect(one).toBe(1);
      expect(two).toBe(2);
      next();
      done();
    });
    stack.run(1, 2);
  });
  it("should not proceed if next() is not called", function(done) {
    var stack = new Stack();
    stack.use(function(next) {
      expect(next).toBeFunction();
      done();
    });
    stack.use(function(next) {
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
      expect(this).toHaveProperty("foo", "FOO");
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
    expect(stack).toHaveProperty("runCount", 1);
    expect(stack.runCount).toBe(1);
    stack.run();
    expect(stack).toHaveProperty("runCount", 2);
    expect(stack.runCount).toBe(2);
  });
});
