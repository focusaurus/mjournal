var async = require("async");
var db = require("app/db");
var errors = require("httperrors");
var joi = require("joi");
var log = require("app/log");
var opMW = require("app/operations/middleware");
var userSchema = require("app/common/userSchema");

var OPTIONS_SCHEMA = joi.object().keys({
  id: joi.number().integer().min(1),
  user: userSchema
});

function initDbOp(run, next) {
  run.dbOp = db("entries").delete();
  next();
}

function execute(run, next) {
  var where = {
    id: run.options.id
  };
  run.dbOp.andWhere(where).exec(function(error, rowCount) {
    if (error) {
      log.info({
        err: error
      }, "error deleting an entry");
      next(error);
      return;
    }
    if (rowCount < 1) {
      log.info(
        {options: run.options},
        "zero rowCount on entry delete (HAX0RZ?)"
      );
      next(new errors.NotFound("No entry with id " + run.options.id));
      return;
    }
    log.debug(where, "entries/delete");
    next();
  });
}

function del(options, callback) {
  var valid = OPTIONS_SCHEMA.validate(options);
  if (valid.error) {
    callback(new errors.BadRequest(valid.error.message));
    return;
  }
  var run = {options: valid.value};

  async.applyEachSeries(
    [
      opMW.requireUser,
      initDbOp,
      opMW.whereUser,
      execute
    ], run, function (error) {
      callback(error);
    }
  );
}

module.exports = del;
