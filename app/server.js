#!/usr/bin/env node
var app = require("app");
var log = require("app/log");
var config = require("config3");

app.listen(config.port, function(error) {
  if (error) {
    log.error(error, "Unable to bind network socket. Exiting");
    /*eslint no-process-exit:0*/
    setTimeout(process.exit.bind(null, 10), 1000);
  }
  log.info({
    port: config.port
  }, "%s express app listening", config.pack.name);
});
