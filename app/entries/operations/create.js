var async = require("async");
var clientFields = require("../clientFields");
var db = require("app/db");
var opMW = require("app/operations/middleware");
var presentEntry = require("../presentEntry");

function insert(run, callback) {
  var tags = run.options.tags || [];
  if (!Array.isArray(tags)) {
    tags = tags.split(" ");
  }
  var entry = {
    userId: run.options.user.id,
    body: run.options.body,
    tags: tags.join(" ")
  };
  db("entries").insert(entry).returning("id").exec(function (error, ids) {
    run.entryId = ids && ids[0];
    callback(error);
  });
}

function select(run, callback) {
  db("entries").select(clientFields).where("id", run.entryId)
    .exec(function (error, rows) {
      if (error) {
        callback(error);
        return;
      }
      run.entry = presentEntry(rows && rows[0]);
      callback();
  });
}

function createEntry(options, callback) {
  var run = {options: options};
  async.applyEachSeries([
    opMW.requireUser,
    insert,
    select
  ], run, function (error) {
    callback(error, run.entry);
  });
}
module.exports = createEntry;
