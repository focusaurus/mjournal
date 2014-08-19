var async = require("async");
var db = require("app/db");
var log = require("app/log");
var presentEntry = require("../presentEntry");
var clientFields = require("../clientFields");

function insert(row, callback) {
  db("entries").insert(row).returning("id").exec(function (error, ids) {
    callback(error, ids && ids[0]);
  });
}

function select(id, callback) {
  db("entries").select(clientFields).where("id", id).exec(callback);
}

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
  log.debug(row, "creating new entry");
  async.waterfall([insert.bind(null, row), select], function (error, rows) {
    if (error) {
      log.error({
        err: error
      }, "createEntry error");
      callback(error);
      return;
    }
    callback(null, presentEntry(rows[0]));
  });
}

module.exports = run;
