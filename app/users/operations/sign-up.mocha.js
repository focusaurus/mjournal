var expect = require("expectacle");
var signIn = require("app/users/operations/sign-in");
var signUp = require("app/users/operations/sign-up");

describe("users/operations/sign-up", function() {
  it("should create a user.id and not return the password", function(done) {
    var newUser = {
      email: "test/users/operations/sign-up@example.com",
      password: "password"
    };
    signUp(newUser, function(error, user) {
      expect(error).toBeNull();
      expect(user).not.toHaveProperty("bcryptedPassword");
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("email", newUser.email);
      expect(user.email).toBe(newUser.email);
      done();
    });
  });
  it("should prevent duplicate emails", function(done) {
    var newUser = {
      email: "dupe@example.com",
      password: "password"
    };
    signUp(newUser, function(error) {
      expect(error).toBeNull();
      signUp(newUser, function(error, user) {
        expect(error).toBeTruthy();
        expect(error).toHaveProperty("code", 409);
        expect(error.code).toBe(409);
        done();
      });
    });
  });
  it("should require a valid-ish email address", function(done) {
    var newUser = {
      email: "no_at_sign_at_example.com",
      password: "password"
    };
    signUp(newUser, function(error) {
      expect(error).toBeTruthy();
      expect(error).toHaveProperty("code", 412);
      expect(error.code).toBe(412);
      done();
    });
  });
});
