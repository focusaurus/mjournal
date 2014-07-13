var Stack = require("app/operations/Stack");
var _ = require("lodash");
var db = require("app/db");
var log = require("app/log");
var opMW = require("app/operations/middleware");

function initDbOp(next) {
  this.dbOp = db.select("entries", ["tags"]).distinct(true);
  next();
}

function execute(next, options, callback) {
  log.debug({
    sql: this.dbOp.toString()
  }, "viewTags");
  this.dbOp.execute(function(error, result) {
    if (error) {
      log.error({
        err: error
      }, "error in viewTags query");
      callback(error);
      return;
    }
    var set = _.map(result.rows, function (row) {return row.tags.split(" ");});
    set = _.flatten(set);
    set = _.uniq(set);
    callback(null, set);
  });
}

function whereTags(next) {
  this.dbOp.where(this.dbOp.c("tags").ne(""));
  next();
}

var stack = new Stack(
  initDbOp,
  opMW.requireUser,
  opMW.whereUser,
  whereTags,
  execute
);

function runStack() {
  stack.run.apply(stack, arguments);
}

module.exports = runStack;
