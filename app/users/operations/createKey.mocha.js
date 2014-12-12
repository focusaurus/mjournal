require("mocha-sinon");
var createKey = require("./createKey");
var db = require("app/db");
var expect = require("chaimel");

describe("users/operations/createKey", function () {
  it("should require a user option", function(done) {
    createKey({}, function (error) {
      expect(error).toExist();
      expect(error.status).toEqual(401);
      done();
    });
  });
});

describe("users/operations/createKey", function () {
  before(function () {
    this.sinon.stub(db.client.QueryBuilder.prototype, "exec")
      .yields(null, 1);
  });
  it("should save to the DB and return value", function(done) {
    createKey({user: {id: 1}}, function (error, value) {
      expect(error).notToExist();
      expect(value).toMatch(/[a-z0-9]{20}/i);
      done();
    });
  });
});
