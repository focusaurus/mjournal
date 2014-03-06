var db = require("app/db");
var log = require("app/log");

function select(where, callback) {
  db.select("entries").where(where).execute(function(error, result) {
    callback(error, result.rows && result.rows[0]);
  });
}

function run(options, callback) {
  if (!options.user) {
    callback({
      code: 401,
      "Please sign in to access your journal": "Please sign in to access your journal"
    });
    return;
  }
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
    userId: options.user.id
  };
  db.update("entries").set(set).where(where).execute(function(error, result) {
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

module.exports = run;
