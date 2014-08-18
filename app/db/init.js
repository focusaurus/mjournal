var _ = require("lodash");
var async = require("async");
var config = require("config3");
var crypto = require("crypto");
var entriesSchema = require("app/entries/schema");
var fs = require("fs");
var glob = require("glob");
var knex = require("knex");
var path = require("path");
var usersSchema = require("app/users/schema");
var util = require("util");

var db = knex({client: "pg", connection: config.db});
var ddl = _.flatten(usersSchema(db), entriesSchema(db));
var adminDb = knex({client: "pg", connection: config.adminDb});

var commands = [];
var passwordMd5Hex = crypto.
  createHash("md5").update(config.db.password).digest("hex");
var createRole = util.format(
  "create role %s login encrypted password '%s'",
  config.db.user,
  passwordMd5Hex
);
commands.push({sql: createRole, code: "42710"});

var createDatabase = util.format('create database "%s" owner %s', config.db.database, config.db.user);
commands.push({sql: createDatabase, code: "3D000"});

function exec(query, callback) {
  query.exec(callback);
}

function alreadyExists(error) {
  return error && ["3D000", "42710"].indexOf(error.code) >= 0;
}

function checkAppDb(callback) {
  // async.each(ddl, exec, console.error);
  // usersSchema(db).exec(console.error);
  // db("users").count().exec(function (error, result) {
  //   console.log("@bug checkAppDb", error, result);
  //   if (error) {
  //     switch (error.code) {
  //       case "3D000":
  //         //database does not exist
  //         console.error("No DB, creating");
  //         break;
  //       default:
  //         console.error("generic error");
  //     }
  //
  //   }
  // });
}

function runCommand(command, callback) {
  console.log("@bug runCommand");
  adminDb.raw(command.sql).exec(function (error, result) {
    console.log("@bug runCommand", error, result);
    if (error && error.code === command.code) {
      callback(null, result);
      return;
    }
    callback(error, result);
  });
}

function runDdl(ddl, callback) {
  console.log("@bug runDdl", ddl);
  adminDb.raw(ddl).exec(function (error, result) {
    if (alreadyExists(error)) {
      callback(null, result);
      return;
    }
    callback(error, result);
  });
}

function runFile(ddlPath, callback) {
  console.log("@bug runFile", ddlPath);
  fs.readFile(ddlPath, "utf8", function (error, ddl) {
    if (error) {
      callback(error);
      return;
    }
    var statements = ddl.split(";");
    async.eachSeries(statements, runDdl, callback);
  });
}

function ensureDatabase(callback) {
  async.eachSeries(commands, runCommand, function (error) {
    ensureSchema(callback);
  });
}

function ensureSchema(callback) {
  var ddlGlob = path.join(__dirname, "..", "**", "*.ddl");
  glob(ddlGlob, function (error, ddlPaths) {
    if (error) {
      callback(error);
      return;
    }
    ddlPaths = _.sortBy(ddlPaths, path.basename);
    console.log("@bug DDLs", ddlPaths);
    async.eachSeries(ddlPaths, runFile, callback);
  });
}

function init(callback) {
  async.series([ensureDatabase, ensureSchema], callback);
}

module.exports = init;

if (require.main === module) {
  init(_.noop);
}
