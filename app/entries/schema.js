var knex = require("knex");

function timestamps(table) {
  ["created", "updated"].forEach(function(column) {
    table.timestamp(column).notNullable().defaultTo("now()");
  });
}

function setup(db) {
  var ddl = [];
  ddl.push(db.schema.createTable("entries", function (table) {
    table.increments();
    table.integer("userId").notNullable().references("user.id");
    timestamps(table);
    table.text("body").notNullable()
    table.string("tags");
    table.specificType("textSearch", "tsvector");
  }));
  ddl.push(
    db.raw('create index "textSearchGin" on entries using gin ("textSearch")'));
  ddl.push(db.raw('CREATE TRIGGER "textSearchUpdate" BEFORE INSERT OR UPDATE' +
    "ON entries FOR EACH ROW EXECUTE PROCEDURE" +
    "tsvector_update_trigger(" +
      "'textSearch', 'pg_catalog.english', 'body', 'tags'" +
    ")"
  ));
  return ddl;
}

module.exports = setup;
