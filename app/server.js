#!/usr/bin/env node
var app = require("app");
var config = require("config3");
var log = require("app/log");

log.debug(
  {env: process.env.NODE_ENV},
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
