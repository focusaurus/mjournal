var _ = require("lodash");
var db = require("app/db");
var log = require("app/log");
var presentEntry = require("../presentEntry");

function run(options, callback) {
  if (!options.user) {
    return callback({
      code: 401,
      "Please sign in to view your journal":
        "Please sign in to view your journal"
    });
  }
  var tags = options.tags || [];
  if (!Array.isArray(tags)) {
    tags = tags.split(" ");
  }
  var row = {
    userId: options.user.id,
    body: options.body,
    tags: tags.join(" ")
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
    callback(null, presentEntry(result.rows[0]));
  });
}

module.exports = run;
