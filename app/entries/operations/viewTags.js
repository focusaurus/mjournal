// var Stack = require("app/operations/Stack");
var _ = require("lodash");
var async = require("async");
var db = require("app/db");
var log = require("app/log");
var opMW = require("app/operations/middleware");

function initDbOp(run, next) {
  run.dbOp = db.select("entries", ["tags"]).distinct(true);
  next();
}

function execute(run, next) {
  log.debug({
    sql: run.dbOp.toString()
  }, "viewTags");
  run.dbOp.execute(function(error, result) {
    if (error) {
      log.error({
        err: error
      }, "error in viewTags query");
      run.options.callback(error);
      return;
    }
    var set = _.map(result.rows, function (row) {return row.tags.split(" ");});
    set = _.flatten(set);
    set = _.uniq(set);
    run.result = set.map(function (tag) {
      return {text: tag};
    });
    next();
  });
}

function whereTags(run, next) {
  run.dbOp.where(run.dbOp.c("tags").ne(""));
  next();
}

// var stack = new Stack(
//   initDbOp,
//   opMW.requireUser,
//   opMW.whereUser,
//   whereTags,
//   execute
// );

function runStack(options, callback) {
  var run = {options: options};
  var stack = [
    initDbOp,
    opMW.requireUser,
    opMW.whereUser,
    whereTags,
    execute
  ];
  async.applyEachSeries(stack, run, function (error) {
    callback(error, run.result);
  });
}

module.exports = runStack;
