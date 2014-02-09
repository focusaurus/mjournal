var signIn = require("app/users/operations/sign-in");
var signUp = require("app/users/operations/sign-up");
var assert = require("chai").assert;

describe("users/operations/sign-up", function() {
  it("should create a user.id and not return the password", function(done) {
    var newUser = {
      email: "test/users/operations/sign-up@example.com",
      password: "password"
    };
    signUp(newUser, function(error, user) {
      assert.isNull(error, error);
      assert.notProperty(user, "bcryptedPassword");
      assert.property(user, "id");
      assert.propertyVal(user, "email", newUser.email);
      done();
    });
  });
  it("should prevent duplicate emails", function(done) {
    var newUser = {
      email: "dupe@example.com",
      password: "password"
    };
    signUp(newUser, function(error) {
      assert.isNull(error, error);
      signUp(newUser, function(error, user) {
        assert.isObject(error);
        assert.propertyVal(error, "code", 409);
        done();
      });
    });
  });
});

describe("users/operations/sign-in", function() {
  var newUser = {
    email: "test/users/operations/sign-in@example.com",
    password: "password"
  };
  before(function(done) {
    signUp(newUser, done);
  });
  it("should the user if password is correct", function(done) {
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
