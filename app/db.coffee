anydb = require "any-db"
gesundheit = require "gesundheit"
dbURL = process.env.MJ_DB_URL || "postgres://mjournal@localhost/mjournal"
gesundheit.defaultEngine = gesundheit.engine dbURL

module.exports = gesundheit
