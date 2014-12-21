"use strict";

exports.up = function up(knex) {
  knex.schema.table("users", function (table) {
    table.timestamp("created").defaultTo(knex.raw("now()"));
  });
};

exports.down = function down(knex) {
  knex.schema.table("users", function (table) {
    table.dropColumn("created");
  });
};
