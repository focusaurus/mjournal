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
      expect(error).not.to.exist;
      expect(user).not.to.have.property("bcryptedPassword");
      expect(user).to.have.property("id");
      expect(user).to.have.property("email", newUser.email);
      done();
    });
  });
  it("should fail with incorrect password", function(done) {
    signIn({
      email: newUser.email,
      password: "incorrect"
    }, function(error, user) {
      expect(error).to.exist;
      expect(error).to.have.property("code", 403);
      done();
    });
  });
});
