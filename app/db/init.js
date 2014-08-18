var _ = require("lodash");
var config = require("config3");
var crypto = require("crypto");
var knex = require("knex");
var util = require("util");

// var db = knex({client: "pg", connection: config.db});
var adminDb = knex({client: "pg", connection: config.adminDb});

function checkAppDb(callback) {
  db("users").count().exec(function (error, result) {
    console.log("@bug checkAppDb", error, result);
    if (error) {
      switch (error.code) {
        case "3D000":
          //database does not exist
          console.error("No DB, creating");
          // createDatabase(db, callback);
          break;
        default:
          console.error("generic error");
      }

    }
  });
}

function checkRole(callback) {
  console.log("@bug checkRole");
  var passwordMd5Hex = crypto.
    createHash("md5").update(config.db.password).digest("hex");
  var createRole = util.format(
    "create role %s login encrypted password '%s'",
    config.db.user,
    passwordMd5Hex
  );
  adminDb.raw(createRole).exec(function (error, result) {
    console.log("@bug create role", error, result);
    if (error) {
      if (error.code = "42710") { //already exists
        callback();
        return;
      }
    }
    callback(error, result);
  });
}

function init(callback) {
  // db.raw("create role mjournal"

}

module.exports = init;

if (require.main === module) {
  // checkAppDb(_.noop);
  checkRole(_.noop);
}
