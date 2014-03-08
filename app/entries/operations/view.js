var db = require("app/db");
var log = require("app/log");
var Stack = require("app/operations").Stack;
var opMW = require("app/operations/middleware");
var stack = new Stack();
stack.use(initDbOp);
stack.use(opMW.requireUser);
stack.use(opMW.whereUser);
stack.use(whereText);
stack.use(opMW.paginated);
stack.use(execute);

function initDbOp(next) {
  this.dbOp = db.select("entries", ["id", "created", "updated", "body", "tags"]).order("created");
  return next();
}

function execute(next, options, callback) {
  log.debug({
    sql: this.dbOp.toString()
  }, "view entries");
  return this.dbOp.execute(function(error, result) {
    if (error) {
      log.error({
        err: error
      }, "error loading entries");
      callback(error);
      return;
    }
    return callback(null, result.rows);
  });
}

function whereText(next, options) {
  var textSearch = options.textSearch && options.textSearch.trim();
  if (textSearch) {
    this.dbOp.where(
      db.text('"entries"."textSearch" @@ to_tsquery($0)', [textSearch])
    );
  }
  next();
}

function runStack() {
  return stack.run.apply(stack, arguments);
}

module.exports = runStack;
