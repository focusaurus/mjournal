var expect = require("expectacle");
var signUp = require("app/users/operations/signUp");
var testUtils = require("app/testUtils");

describe("POST /api/users/sign-in", function() {
  [
    {},
    {email: "test@example.com"},
    {password: "password"}
  ].forEach(function(user) {
    it("should 400 incomplete credentials", function(done) {
      testUtils.post("/api/users/sign-in")
        .send(user)
        .expect(400)
        .end(done);
    });
  });

  it("should 200 a valid user", function(done) {
    var newUser = {
      email: "users/api/signUp@example.com",
      password: "password"
    };
    signUp(newUser, function(error) {
      expect(error).toBeNull();
      testUtils.post("/api/users/sign-in")
        .send(newUser)
        .expect(200)
        .end(done);
    });
  });
});

describe("POST /api/users/sign-up", function() {
  [
   {},
   {email: "test@example.com"},
   {password: "password"}
  ].forEach(function(user) {
    it("should 400 incomplete credentials", function(done) {
      testUtils.post("/api/users/sign-up")
        .send(user)
        .expect(400)
        .end(done);
    });
  });

  it("should 409 a re-register", function(done) {
    var newUser = {
      email: "users/api/signUp/re-register@example.com",
      password: "password"
    };
    signUp(newUser, function(error) {
      expect(error).toBeNull();
      testUtils.post("/api/users/sign-up")
        .send(newUser)
        .expect(409)
        .end(done);
    });
  });
});
