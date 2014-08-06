var clientFields = require("../clientFields");
var db = require("app/db");
var joi = require("joi");
var log = require("app/log");
var opMW = require("app/operations/middleware");
var presentEntry = require("../presentEntry");
var Stack = require("app/operations/Stack");

var OPTIONS_SCHEMA = joi.object().keys({
  before: joi.date(),
  textSearch: joi.string(),
  user: joi.object(),
  page: joi.number().integer().min(1)
});

function initDbOp(next, options) {
  OPTIONS_SCHEMA.validate(options, function (error, result) {
    if (error) {
      next(error);
      return;
    }
    options = result;
  });
  //We want a page of the most recent entries,
  //but we want the page ordered with newest at the end
  //so we sort descending in the database and then
  //reverse that in memory
  this.dbOp = db.select("entries", clientFields).order("created descending");
  if (options.before) {
    this.dbOp.where("created").lt(before)
  }
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
    callback(null, result.rows.reverse().map(presentEntry));
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

function whereBefore(next, options) {
  var before = new Date(options.before);
  if (options.before) {
    this.dbOp.where("created").lt(options.before);
  }
  next();
}

var stack = new Stack(
  initDbOp,
  opMW.requireUser,
  opMW.whereUser,
  whereText,
  whereBefore,
  opMW.paginated,
  execute
);

function runStack() {
  stack.run.apply(stack, arguments);
}

module.exports = runStack;
