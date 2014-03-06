var _ = require("lodash");
var db = require("app/db");
var log = require("app/log");

function run(options, callback) {
  if (!options.user) {
    return callback({
      code: 401,
      "Please sign in to view your journal": "Please sign in to view your journal"
    });
  }
  var row = {
    userId: options.user.id,
    body: options.body,
    tags: options.tags
  };
  var returning = ["id", "created", "updated"].concat(_.keys(row));
  log.debug(row, "creating new entry");
  var dbOp = db.insert("entries", row).returning(returning);
  dbOp.execute(function(error, result) {
    if (error) {
      log.error({
        err: error
      }, "createEntry error");
      callback(error);
      return;
    }
    callback(null, result.rows[0]);
  });
}

module.exports = run;
