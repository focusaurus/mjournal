var async = require("async");
var clientFields = require("../clientFields");
var db = require("app/db");
var errors = require("httperrors");
var joi = require("joi");
var log = require("app/log");
var opMW = require("app/operations/middleware");
var presentEntry = require("../presentEntry");

var OPTIONS_SCHEMA = joi.object().keys({
  after: joi.number().integer().min(1),
  before: joi.number().integer().min(1),
  textSearch: joi.string().allow(""),
  user: joi.object(),
  page: joi.number().integer().min(1)
});

function findAnchor(run, next) {
  var valid = OPTIONS_SCHEMA.validate(run.options);
  if (valid.error) {
    next(new errors.BadRequest(valid.error.message));
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
  var anchorQuery = db("entries").select(["created"])
    .where(where).limit(1);
  anchorQuery.exec(function (error, rows) {
    if (error) {
      next(error);
      return;
    }
    run.anchor = rows[0];
    next();
  });
}

function initQuery(run, next) {
  //We want a page of the most recent entries,
  //but we want the page ordered with newest at the end
  //so we sort descending in the database and then
  //reverse that in memory
  run.dbOp = db("entries").select(clientFields);
  run.reverseResults = true;
  var direction = "desc";
  if (run.anchor) {
    if (run.options.before) {
      run.dbOp.where("created", "<", run.anchor.created);
    } else {
      //We need to round up here because our JS dates are millisecond
      //resolution, but in postgres is nanosecond resolution,
      //which means pagination can show a entry on 2 pages
      //because it can be "created after itself"
      var roundUp = new Date(run.anchor.created.valueOf() + 1);
      run.dbOp.where("created", ">", roundUp);
      direction = "asc";
      run.reverseResults = false;
    }
  }
  run.dbOp.orderBy("created", direction);
  next();
}

function whereText(run, next) {
  var textSearch = run.options.textSearch && run.options.textSearch.trim();
  if (textSearch) {
    run.dbOp.whereRaw(
      /*eslint quotes:0*/
      '"entries"."textSearch" @@ to_tsquery(?)',
      [textSearch]
    );
  }
  next();
}

function execute(run, next) {
  log.debug({
    sql: run.dbOp.toString()
  }, "view entries");
  run.dbOp.exec(function(error, rows) {
    if (error) {
      log.error({
        err: error
      }, "error loading entries");
      next(error);
      return;
    }
    if (run.reverseResults) {
      rows = rows.reverse();
    }
    run.result = rows.map(presentEntry);
    next();
  });
}

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
