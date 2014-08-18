#!/usr/bin/env node
if (process.env.NODE_ENV !== "test") {
  console.error("Refusing to wipe non-test DB." +
    " Edit this wipe.js script if you seriously want to wipe a dev/prod DB");
  /*eslint no-process-exit:0*/
  process.exit(10);
}

var db = require("app/db").knex;
var fs = require("fs");
var hl = require("highland");
var log = require("app/log");
var path = require("path");
var split = require("split");

var sqlPath = path.join(__dirname, "createSchema.sql");
var stream = fs.createReadStream(sqlPath).pipe(split(";"));

function run(sql, callback) {
  sql = sql.trim();
  // console.log(sql);
  log.debug(sql);
  if (!sql) {
    callback();
    db.close();
    return;
  }
  db.query(sql, callback);
}

hl(stream)
  .invoke("toString")
  .map(hl.wrapCallback(run))
  .stopOnError(console.error)
  .series()
  .resume();
