var config = require("config3");
var knex = require("knex");
module.exports = knex({client: "pg", connection: config.db});
