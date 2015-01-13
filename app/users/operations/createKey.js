var async = require("async");
var opMW = require("app/operations/middleware");
var db = require("app/db");
var token = require("rand-token").generator({source: "crypto"});

function generate(run, callback) {
  try {
    run.key = token.generate(20);
    callback();
  } catch (error) {
    callback(error);
  }
}

function insert(run, callback) {
  db("keys").insert({
    userId: run.options.user.id,
    value: run.key
  }).exec(callback);
}

function invalidate(run, callback) {
  db("keys")
    .update({valid: false})
    .where({userId: run.options.user.id})
    .exec(callback);
}

function createKey(options, callback) {
  var run = {options: options};
  async.applyEachSeries(
    [
      opMW.requireUser,
      generate,
      invalidate,
      insert
    ], run, function (error) {
      callback(error, run.key);
    }
  );
}

module.exports = createKey;
