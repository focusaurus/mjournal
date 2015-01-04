"use strict";

exports.up = function up(knex) {
  return knex.schema.table("users", function (table) {
    table.timestamp("created").notNullable().defaultTo(knex.raw("now()"));
    table.string("theme");
  });
};

exports.down = function down(knex) {
  return knex.schema.table("users", function (table) {
    table.dropColumn("created");
    table.dropColumn("theme");
  });
};
