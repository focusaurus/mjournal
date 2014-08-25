require("mocha-sinon");
var createToken = require("./createToken");
var db = require("app/db");
var expect = require("expectacle");

describe("users/operations/createToken", function () {
  it("should require a user option", function(done) {
    createToken({}, function (error) {
      expect(error).toBeTruthy();
      expect(error.status).toBe(401);
      done();
    });
  });
});

describe("users/operations/createToken", function () {
  before(function () {
    this.sinon.stub(db.client.QueryBuilder.prototype, "exec")
      .yields(null, 1);
  });
  it("should save to the DB and return value", function(done) {
    createToken({user: {id: 1}}, function (error, value) {
      expect(error).toBeFalsy();
      expect(value).toBeOfType("string");
      expect(value).toMatch(/[a-z0-9]{20}/i);
      done();
    });
  });
});
