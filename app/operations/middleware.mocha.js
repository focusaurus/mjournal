var paginated = require("app/operations/middleware").paginated;
var db = require("app/db");
var assert = require("assert");

describe("app/operations/middleware.paginated", function() {
  it("should set page 1 by default and a default limit", function(done) {
    var run = {
      options: {},
      dbOp: db.select("example", ["id"])
    };
    var next = function() {
      var sql = run.dbOp.compile()[0].toLowerCase();
      assert(sql.indexOf("limit ") >= 0);
      assert(sql.indexOf("offset ") < 0);
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
      var sql = run.dbOp.compile()[0].toLowerCase();
      assert(sql.indexOf("limit ") >= 0);
      assert(sql.indexOf("offset ") >= 0);
      done();
    };
    paginated.call(null, run, next);
  });
});
