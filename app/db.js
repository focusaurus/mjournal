var anydb = require("any-db");
var gesundheit = require("gesundheit");
var dbURL = process.env.MJ_DB_URL || "postgres://mjournal@localhost/mjournal";
gesundheit.defaultEngine = gesundheit.engine(dbURL);

module.exports = gesundheit;
module.exports.dbURL = dbURL;
