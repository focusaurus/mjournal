var paginated = require("app/operations/middleware").paginated;
var db = require("app/db");
var assert = require("assert");

describe("app/operations/middleware.paginated", function() {
  it("should set page 1 by default and a default limit", function(done) {
    var context = {
      dbOp: db.select("example", ["id"])
    };
    var next = function() {
      var sql = context.dbOp.compile()[0].toLowerCase();
      assert(sql.indexOf("limit ") >= 0);
      assert(sql.indexOf("offset ") < 0);
      done();
    };
    paginated.call(context, next, {});
  });
  it("should set limit and offset when page is > 1", function(done) {
    var context = {
      dbOp: db.select("example", ["id"])
    };
    var next = function() {
      var sql = context.dbOp.compile()[0].toLowerCase();
      assert(sql.indexOf("limit ") >= 0);
      assert(sql.indexOf("offset ") >= 0);
      done();
    };
    paginated.call(context, next, {
      page: "42"
    });
  });
});
