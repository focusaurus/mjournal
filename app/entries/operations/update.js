var _ = require("lodash");
var async = require("async");
var clientFields = require("../clientFields");
var db = require("app/db");
var errors = require("app/errors");
var log = require("app/log");
var opMW = require("app/operations/middleware");
var presentEntry = require("../presentEntry");

function select(where, run, next) {
  db.select("entries", clientFields)
    .where(where)
    .execute(function(error, result) {
      run.result = presentEntry(result.rows && result.rows[0]);
      next(error);
  });
}

function initDbOp(run, next) {
  run.dbOp = db.update("entries");
  return next();
}

function execute(run, next) {
  var set = {
    updated: new Date()
  };
  ["body", "tags"].forEach(function (property) {
    if (_.has(run.options, property)) {
      set[property] = run.options[property];
    }
  });
  if (Array.isArray(set.tags)) {
    set.tags = set.tags.join(" ");
  }
  var where = {
    id: run.options.id
  };
  run.dbOp.set(set).where(where).execute(function(error, result) {
    if (error) {
      log.info({
        err: error
      }, "error updating an entry");
      next(error);
      return;
    }
    if (result.rowCount < 1) {
      log.info(
        {options: run.options},
        "zero rowCount on entry update (HAX0RZ?)"
      );
      next(new errors.NotFound("No entry with id " + run.options.id));
      return;
    }
    log.debug(result, "entries/update");
    select(where, run,  next);
  });
}

function update(options, callback) {
  var run = {options: options};
  async.applyEachSeries(
    [
      opMW.requireUser,
      initDbOp,
      opMW.whereUser,
      execute
    ], run, function (error) {
      callback(error, run.result);
    }
  );
}

module.exports = update;
