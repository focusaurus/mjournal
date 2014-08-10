// var Stack = require("app/operations/Stack");
var async = require("async");
var clientFields = require("../clientFields");
var db = require("app/db");
var joi = require("joi");
var log = require("app/log");
var opMW = require("app/operations/middleware");
var presentEntry = require("../presentEntry");

var OPTIONS_SCHEMA = joi.object().keys({
  after: joi.number().integer().min(1),
  before: joi.number().integer().min(1),
  textSearch: joi.string(),
  user: joi.object(),
  page: joi.number().integer().min(1)
});

function findAnchor(run, next) {
  var valid = OPTIONS_SCHEMA.validate(run.options);
  if (valid.error) {
    next(valid.error);
    return;
  }
  run.options = valid.value;

  var anchorId = run.options.before || run.options.after;
  if (!anchorId) {
    next();
    return;
  }
  //userId in this where clause enforces authorization/privacy
  //you can only query based on your own entries
  var where = {
    id: anchorId,
    userId: run.options.user.id
  };
  var anchorQuery = db.select("entries", ["created"])
    .where(where).limit(1);
  anchorQuery.execute(function (error, result) {
    if (error) {
      run.options.callback(error);
      return;
    }
    run.anchor = result.rows[0];
    next();
  });
}

function initQuery(run, next) {
  //We want a page of the most recent entries,
  //but we want the page ordered with newest at the end
  //so we sort descending in the database and then
  //reverse that in memory
  run.dbOp = db.select("entries", clientFields);
  run.reverseResults = true;
  var order = "created descending";
  if (run.anchor) {
    var anchorWhere = {created: {}};
    if (run.options.before) {
      anchorWhere.created.lt = run.anchor.created;
    } else {
      anchorWhere.created.gt = run.anchor.created;
      order = "created ascending";
      run.reverseResults = false;
    }
    run.dbOp.where(anchorWhere);
  }
  run.dbOp.order(order);
  next();
}

function whereText(run, next) {
  var textSearch = run.options.textSearch && run.options.textSearch.trim();
  if (textSearch) {
    run.dbOp.where(
      /*eslint quotes:0*/
      db.text('"entries"."textSearch" @@ to_tsquery($0)', [textSearch])
    );
  }
  next();
}

function execute(run, next) {
  log.debug({
    sql: run.dbOp.toString()
  }, "view entries");
  run.dbOp.execute(function(error, result) {
    if (error) {
      log.error({
        err: error
      }, "error loading entries");
      run.options.callback(error);
      return;
    }
    var rows = result.rows;
    if (run.reverseResults) {
      rows = rows.reverse();
    }
    run.result = rows.map(presentEntry);
    next();
  });
}

// var stack = new Stack(
//   opMW.requireUser,
//   findAnchor,
//   initQuery,
//   opMW.whereUser,
//   whereText,
//   opMW.paginated,
//   execute
// );

function runStack(options, callback) {
  var run = {options: options};
  var stack = [
    opMW.requireUser,
    findAnchor,
    initQuery,
    opMW.whereUser,
    whereText,
    opMW.paginated,
    execute
  ];
  async.applyEachSeries(stack, run, function (error) {
    callback(error, run.result);
  });
}

module.exports = runStack;
