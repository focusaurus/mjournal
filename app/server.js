#!/usr/bin/env node
var app = require("app");
var log = require("app/log");
var config = require("config3");

app.listen(config.port, function(error) {
  if (error) {
    log.fatal("Unable to bind network socket. Exiting", {
      err: error
    });
    process.exit(10);
  }
  log.info({
    port: config.port
  }, "mjournal express app listening");
});
