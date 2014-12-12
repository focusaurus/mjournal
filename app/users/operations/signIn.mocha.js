var expect = require("chaimel");
var signIn = require("app/users/operations/signIn");
var signUp = require("app/users/operations/signUp");

describe("users/operations/signIn", function() {
  var newUser = {
    email: "test/users/operations/signIn@example.com",
    password: "password"
  };
  before(function(done) {
    signUp(newUser, done);
  });
  it("should return the user if password is correct", function(done) {
    signIn(newUser, function(error, user) {
      expect(error).toBeNull();
      expect(user).notToHaveProperty("bcryptedPassword");
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("email");
      expect(user.email).toEqual(newUser.email.toLowerCase());
      done();
    });
  });
  it("should fail with incorrect password", function(done) {
    signIn({
      email: newUser.email,
      password: "incorrect"
    }, function(error) {
      expect(error).toExist();
      expect(error).toHaveProperty("status");
      expect(error.status).toEqual(403);
      done();
    });
  });
});
