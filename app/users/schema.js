var knex = require("knex");

function setup(db) {
  return db.schema.createTable("users", function (table) {
    table.increments();
    table.string("email").notNullable().unique();
    table.string("bcryptedPassword", 60).notNullable();
  });
}

module.exports = setup;
