var signIn = require("app/users/operations/sign-in");
var signUp = require("app/users/operations/sign-up");
var expect = require("chai").expect;

describe("users/operations/sign-up", function() {
  it("should create a user.id and not return the password", function(done) {
    var newUser = {
      email: "test/users/operations/sign-up@example.com",
      password: "password"
    };
    signUp(newUser, function(error, user) {
      expect(error).not.to.exist;
      expect(user).not.to.have.property("bcryptedPassword");
      expect(user).to.have.property("id");
      expect(user).to.have.property("email", newUser.email);
      done();
    });
  });
  it("should prevent duplicate emails", function(done) {
    var newUser = {
      email: "dupe@example.com",
      password: "password"
    };
    signUp(newUser, function(error) {
      expect(error).not.to.exist;
      signUp(newUser, function(error, user) {
        expect(error).to.exist;
        expect(error).to.have.property("code", 409);
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
      expect(error, "callback should get an error").to.exist;
      expect(error).to.have.property("code", 412);
      done();
    });
  });
});
