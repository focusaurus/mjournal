var clientFields = require("../clientFields");
var db = require("app/db");
var joi = require("joi");
var log = require("app/log");
var opMW = require("app/operations/middleware");
var presentEntry = require("../presentEntry");
var Stack = require("app/operations/Stack");

var OPTIONS_SCHEMA = joi.object().keys({
  before: joi.number().integer().min(1),
  textSearch: joi.string(),
  user: joi.object(),
  page: joi.number().integer().min(1)
});

function initDbOp(next, options) {
  var self = this;
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
    //userId in this where clause enforces authorization/privacy
    //you can only query based on your own entries
    var where = {
      id: options.before,
      userId: options.user.id
    }
    var findBefore = db.select("entries", ["created"])
      .where(where).limit(1);
    findBefore.execute(function (error, result) {
      if (error) {
        callback(error);
        return;
      }
      var beforeEntry = result.rows[0];
      if (beforeEntry) {
        self.dbOp.where({created: {lt: beforeEntry.created}});
      }
      next();
    });
  } else {
    next();
  }
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
