var _ = require("lodash");
var async = require("async");
var config = require("config3");
var crypto = require("crypto");
var fs = require("fs");
var knex = require("knex");
var log = require("app/log");
var path = require("path");
var util = require("util");

var dbConfig = _.clone(config.postgres);
var db = knex({client: "pg", connection: config.db});
var postgres = knex({client: "pg", connection: config.postgres});

function alreadyExists(error) {
  return error && ["3D000", "42710", "42P04", "42P07"].indexOf(error.code) >= 0;
}

function runDdl(onDb, ddl, callback) {
  if (!ddl.trim()) {
    setImmediate(callback);
    return;
  }
  log.debug({ddl: ddl}, "running db init DDL");
  onDb.raw(ddl).exec(function (error, result) {
    if (alreadyExists(error)) {
      log.debug("recognized an already exists error code");
      callback(null, result);
      return;
    }
    callback(error, result);
  });
}

function runFile(ddlPath, callback) {
  log.debug({path: ddlPath}, "running db init DDL file");
  fs.readFile(ddlPath, "utf8", function (error, ddl) {
    if (error) {
      callback(error);
      return;
    }
    var statements = ddl.split(";");
    async.eachSeries(statements, async.apply(runDdl, db), callback);
  });
}

function ensureDatabase(callback) {
  var passwordMd5Hex = crypto.
    createHash("md5").update(config.db.password).digest("hex");
  var createRole = util.format(
    "create role %s login encrypted password '%s'",
    config.db.user,
    passwordMd5Hex
  );
  var createDatabase = util.format(
    'create database "%s" owner %s', config.db.database, config.db.user);
  async.eachSeries(
    [createRole, createDatabase],
    runDdl.bind(null, postgres),
    callback
  );
}

function ensureSchema(callback) {
  var ddlPaths = [
    path.join(__dirname, "../users/users.ddl"),
    path.join(__dirname, "../entries/entries.ddl")
  ];
  async.eachSeries(ddlPaths, runFile, callback);
}

function init(callback) {
  async.series([ensureDatabase, ensureSchema], callback);
}

module.exports = {
  init: init,
  ensureDatabase: ensureDatabase,
  ensureSchema: ensureSchema,
  runDdl: runDdl,
  runFile: runFile,
  postgres: postgres
};

if (require.main === module) {
  init(_.noop);
}
