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

describe("POST /api/users/token anonymous", function () {
  it("should 401 an anonymous user", function(done) {
    testUtils.post("/api/users/token")
      .expect(401, done);
  });
});

describe("POST /api/users/token authorized", function () {
  var token;
  before(function (done) {
    this.session = new testUtils.Session();
    this.session.post("/api/users/sign-up")
      .send({email: "token/authorized@example.com", password: "password"})
      .expect(201)
      .end(done);
  });

  it("should 201 a token for a known user", function(done) {
    this.session.post("/api/users/token")
      .expect(201)
      .end(function (error, res) {
        expect(res.body).toHaveProperty("value");
        expect(res.body.value.length).toEqual(20);
        token = res.body.value;
        done();
      });
  });

  //test depends on previous one. kthnxbai.
  it("should allow access to entries with token", function (done) {
    testUtils.get("/api/entries")
     .set("Authorization", "token " + token)
     .expect("Content-Type", "application/json; charset=utf-8")
     .expect(200, done);
  });
});
