var _ = require("lodash");
var async = require("async");
var db = require("app/db");
var log = require("app/log");
var opMW = require("app/operations/middleware");

function initDbOp(run, next) {
  run.dbOp = db("entries").distinct("tags").select()
    .where("tags", "!=", "");
  next();
}

function execute(run, next) {
  log.debug({
    sql: run.dbOp.toString()
  }, "viewTags");
  run.dbOp.exec(function(error, rows) {
    if (error) {
      log.error({
        err: error
      }, "error in viewTags query");
      next(error);
      return;
    }
    var set = _.map(rows, function (row) {
      return row.tags.split(" ");
    });
    set = _.flatten(set);
    set = _.uniq(set);
    run.result = set.map(function (tag) {
      return {text: tag};
    });
    next();
  });
}

function view(options, callback) {
  var run = {options: options};
  var stack = [
    opMW.requireUser,
    initDbOp,
    opMW.whereUser,
    execute
  ];
  async.applyEachSeries(stack, run, function (error) {
    callback(error, run.result);
  });
}

module.exports = view;
