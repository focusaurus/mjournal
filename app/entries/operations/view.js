var clientFields = require("../clientFields");
var db = require("app/db");
var log = require("app/log");
var opMW = require("app/operations/middleware");
var presentEntry = require("../presentEntry");
var Stack = require("app/operations/Stack");

function initDbOp(next) {
  this.dbOp = db.select("entries", clientFields).order("created");
  next();
}

function execute(next, options, callback) {
  log.debug({
    sql: this.dbOp.toString()
  }, "view entries");
  this.dbOp.execute(function(error, result) {
    if (error) {
      log.error({
        err: error
      }, "error loading entries");
      callback(error);
      return;
    }
    callback(null, result.rows.map(presentEntry));
  });
}

function whereText(next, options) {
  var textSearch = options.textSearch && options.textSearch.trim();
  if (textSearch) {
    this.dbOp.where(
      /*eslint quotes:0*/
      db.text('"entries"."textSearch" @@ to_tsquery($0)', [textSearch])
    );
  }
  next();
}

var stack = new Stack(
  initDbOp,
  opMW.requireUser,
  opMW.whereUser,
  whereText,
  opMW.paginated,
  execute
);

function runStack() {
  stack.run.apply(stack, arguments);
}

module.exports = runStack;
