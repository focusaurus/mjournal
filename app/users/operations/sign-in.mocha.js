var expect = require("expectacle");
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
      expect(error).toBeNull();
      expect(user).not.toHaveProperty("bcryptedPassword");
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("email");
      expect(user.email).toBe(newUser.email);
      done();
    });
  });
  it("should fail with incorrect password", function(done) {
    signIn({
      email: newUser.email,
      password: "incorrect"
    }, function(error, user) {
      expect(error).toBeTruthy();
      expect(error).toHaveProperty("code");
      expect(error.code).toBe(403);
      done();
    });
  });
});
