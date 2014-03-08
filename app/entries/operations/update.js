var db = require("app/db");
var log = require("app/log");
var opMW = require("app/operations/middleware");
var Stack = require("app/operations").Stack;

function select(where, callback) {
  db.select("entries").where(where).execute(function(error, result) {
    callback(error, result.rows && result.rows[0]);
  });
}

function initDbOp(next, options) {
  this.dbOp = db.update("entries");
  return next();
}

function execute(next, options, callback) {
  var set = {
    updated: new Date()
  };
  ["body", "tags"].forEach(function (property) {
    if (options[property] !== null) {
      set[property] = options[property];
    }
  });
  var where = {
    id: options.id,
  };
  this.dbOp.set(set).where(where).execute(function(error, result) {
    if (error) {
      log.info({
        err: error
      }, "error updating an entry");
      callback(error);
      return;
    }
    log.debug(result, "entries/update");
    select(where, callback);
  });
}

function runStack() {
  var stack = new Stack();
  stack.use(opMW.requireUser);
  stack.use(initDbOp);
  stack.use(opMW.whereUser);
  stack.use(execute);
  return stack.run.apply(stack, arguments);
}

module.exports = runStack;
