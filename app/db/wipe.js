#!/usr/bin/env node
if (process.env.NODE_ENV !== "test") {
  console.error("Refusing to wipe non-test DB." +
    " Edit this wipe.js script if you seriously want to wipe a dev/prod DB");
  /*eslint no-process-exit:0*/
  process.exit(10);
}
var config = require("config3");
config.logStream = process.stdout;

var async = require("async");
var log = require("app/log");
var path = require("path");
//eslint bug thinks "setup" is a global from mocha
//https://github.com/eslint/eslint/issues/1059
var setup2 = require("./setup");

var WIPE_DDL = path.join(__dirname, "wipe.ddl");

log.info("wiping test database");
async.series([
  setup2.ensureDatabase,
  setup2.runFile.bind(null, WIPE_DDL),
  setup2.ensureSchema
], function (error) {
  if (error) {
    log.error(error, "Error wiping test database");
    process.exit(20);
  }
  log.debug("test database wiped successfully");
  process.exit();
});
