#!/usr/bin/env node
var _ = require("lodash");
var app = require("app");
var config = require("config3");
var log = require("app/log");
//eslint bug thinks "setup" is a global from mocha
//https://github.com/eslint/eslint/issues/1059
var setup2 = require("app/db/setup");
var validateConfig = require("./validateConfig");

process.on("uncaughtException", function (error) {
  var message = "uncaught exception. Process will exit.";
  log.error(error, message);
  //In case log is not writeable, etc
  console.error(message, error);
  setTimeout(process.exit.bind(null, 66), 1000);
});

log.debug(
  {
    env: process.env.NODE_ENV,
    db: _.omit(config.db, "password")
  },
  "%s server process starting", config.pack.name
);
var valid = validateConfig(config);
if (valid.error) {
  log.error(valid.error, "Config is invalid. Process will exit.");
  setTimeout(process.exit.bind(null, 66), 1000);
}

setup2.init(function (error) {
  if (error) {
    log.error(error, "Error ensuring database is ready. Process will exit.");
    setTimeout(process.exit.bind(null, 20), 1000);
  }
  app.listen(config.port, config.ip, function(error) {
    if (error) {
      log.error(error, "Unable to bind network socket. Exiting");
      /*eslint no-process-exit:0*/
      setTimeout(process.exit.bind(null, 10), 1000);
    }
    log.info(
      {port: config.port},
       "%s express app listening", config.pack.name
    );
  });
});
