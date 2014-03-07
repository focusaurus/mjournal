var assert = require("chai").assert;
var expect = require("chai").expect;
var signIn = require("app/users/operations/sign-in");
var signUp = require("app/users/operations/sign-up");

describe("users/operations/sign-in", function() {
  var newUser = {
    email: "test/users/operations/sign-in@example.com",
    password: "password"
  };
  before(function(done) {
    signUp(newUser, done);
  });
  it("should return the user if password is correct", function(done) {
    signIn(newUser, function(error, user) {
      assert.isNull(error, error);
      assert.notProperty(user, "bcryptedPassword");
      assert.property(user, "id");
      assert.propertyVal(user, "email", newUser.email);
      done();
    });
  });
  it("should fail with incorrect password", function(done) {
    signIn({
      email: newUser.email,
      password: "incorrect"
    }, function(error, user) {
      assert.isObject(error);
      assert.propertyVal(error, "code", 403);
      done();
    });
  });
});
