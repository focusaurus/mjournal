{paginated} = require "app/operations/middleware"
db = require "app/db"
assert = require "assert"
#sinon = require "sinon"

describe "paginated middleware", ->
  it "should set page 1 by default and a default limit", (done) ->
    context =
      dbOp: db.select("example", ["id"])
    next = ->
      sql = context.dbOp.compile()[0].toLowerCase()
      assert sql.indexOf('limit ') >= 0
      #offset clause gets omitted entirely when it would be 0
      assert sql.indexOf('offset ') < 0
      done()
    paginated.call context, next, {}

  it "should set limit and offset when page is > 1", (done) ->
    context =
      dbOp: db.select("example", ["id"])
    next = ->
      sql = context.dbOp.compile()[0].toLowerCase()
      assert sql.indexOf('limit ') >= 0
      #offset clause gets omitted entirely when it would be 0
      assert sql.indexOf('offset ') >= 0
      done()
    paginated.call context, next, {page: "42"}
