#!/usr/bin/env node
var _ = require("lodash");
var app = require("app");
var config = require("config3");
var log = require("app/log");

process.on("uncaughtException", function (error) {
  log.fatal(error, "uncaught exception. Process will exit.");
  setTimeout(process.exit.bind(null, 66), 2000);
});

log.debug(
  {
    env: process.env.NODE_ENV,
    db: _.without(config.db, "password")
  },
  "%s server process starting", config.pack.name
);

app.listen(config.port, function(error) {
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
