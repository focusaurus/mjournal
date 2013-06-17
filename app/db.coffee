anydb = require "any-db"
gesundheit = require "gesundheit"
dbURL = process.env.MJ_DB_URL || "sqlite3://var/mjournal.sqlite3"
console.log "Creating DB engine", dbURL
gesundheit.defaultEngine = gesundheit.engine dbURL

module.exports = gesundheit
