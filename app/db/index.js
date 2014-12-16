var backoff = require("backoff");
var config = require("config3");
var errors = require("app/errors");
var knex = require("knex");
var log = require("app/log");
var db = module.exports = knex({client: "pg", connection: config.db});

function forceReconnect(callback) {
  db("users").select("*").limit(1).exec(callback);
}

var call = backoff.call(forceReconnect, function(error) {
  if (error) {
    log.info({retries: call.getNumRetries()}, "backoff.call errored");
    return;
  }
  log.info("backoff.call succeeded. Resetting.");
  call.reset();
});

call.on("backoff", function () {
  log.info("Db backoff happening");
});
call.setStrategy(new backoff.ExponentialStrategy());

function connectionError(error) {
  if (errors.canWithstand(error)) {
    if (call.isPending()) {
      call.start();
    }
    return;
  }
  // Time to die
  throw error;
}

function afterCreate(connection, callback) {
  connection.on("error", connectionError);
  callback(null, connection);
}

db.client.pool.config.afterCreate = afterCreate;
