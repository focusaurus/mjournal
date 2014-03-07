var Stack = require("app/operations").Stack;
var expect = require("chai").expect;

describe("operations middleware Stack", function() {
  it("should call a function in the stack with the args from run", function(done) {
    var stack = new Stack;
    stack.use(function(next, one, two) {
      expect(next).to.be.a("function");
      expect(one).to.equal(1);
      expect(two).to.equal(2);
      next();
      done();
    });
    stack.run(1, 2);
  });
  it("should not proceed if next() is not called", function(done) {
    var stack = new Stack;
    stack.use(function(next) {
      expect(next).to.be.a("function");
      done();
    });
    stack.use(function(next) {
      assert(false, "stack should never have invoked this middleware");
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
      expect(this).to.have.property("foo", "FOO");
      next();
      done();
    });
    stack.run();
  });
});
