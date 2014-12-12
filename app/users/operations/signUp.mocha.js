var expect = require("chaimel");
var signUp = require("app/users/operations/signUp");

describe("users/operations/signUp", function() {
  it("should create a user.id and not return the password", function(done) {
    var newUser = {
      email: "test/users/operations/signUp@example.com",
      password: "password"
    };
    signUp(newUser, function(error, user) {
      expect(error).toBeNull();
      expect(user).notToHaveProperty("bcryptedPassword");
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("email");
      expect(user.email).toEqual(newUser.email.toLowerCase());
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
      signUp(newUser, function(error) {
        expect(error).toExist();
        expect(error).toHaveProperty("status");
        expect(error.status).toEqual(409);
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
      expect(error).toExist();
      expect(error).toHaveProperty("status");
      expect(error.status).toEqual(400);
      done();
    });
  });
});
