var paginated = require("app/operations/middleware").paginated;
var db = require("app/db");
var expect = require("chai").expect;

describe("app/operations/middleware.paginated", function() {
  it("should set page 1 by default and a default limit", function(done) {
    var context = {
      dbOp: db.select("example", ["id"])
    };
    var next = function() {
      var sql = context.dbOp.compile()[0].toLowerCase();
      expect(sql).to.contain('limit ');
      expect(sql).not.to.contain('offset ');
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
      expect(sql).to.contain('limit ');
      expect(sql).to.contain('offset ');
      done();
    };
    paginated.call(context, next, {
      page: "42"
    });
  });
});
