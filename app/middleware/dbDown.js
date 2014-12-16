var db = require("app/db");
var pathval = require("pathval");

function dbDown(req, res, next) {
  if (pathval.get(db, "client.pool.genericPool.availableObjects.length") > 0) {
    next();
    return;
  }
  res.locals.cause = "Database is down";
  res.render("dbDown");
}

module.exports = dbDown;
