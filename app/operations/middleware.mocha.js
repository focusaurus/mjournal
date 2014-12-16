var paginated = require("app/operations/middleware").paginated;
var db = require("app/db");
var expect = require("chaimel");

describe("app/operations/middleware.paginated", function() {

  it("should set page 1 by default and a default limit", function(done) {
    var run = {
      options: {},
      dbOp: db.select("example", ["id"])
    };
    var next = function() {
      var sql = run.dbOp.toString().toLowerCase();
      expect(sql).toInclude("limit '50'");
      expect(sql).notToInclude("offset '0'");
      done();
    };
    paginated.call(null, run, next);
  });

  it("should set limit and offset when page is > 1", function(done) {
    var run = {
      dbOp: db.select("example", ["id"]),
      options: {
        page: "42"
      }
    };
    var next = function() {
      var sql = run.dbOp.toString().toLowerCase();
      expect(sql).toInclude("limit ");
      expect(sql).toInclude("offset ");
      done();
    };
    paginated.call(null, run, next);
  });
});
