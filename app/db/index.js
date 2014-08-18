var config = require("config3");
var knex = knex({client: "pg", connection: config.db});
knex.init = require("./init");
module.exports = knex;
