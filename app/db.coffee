anydb = require "any-db"
gesundheit = require "gesundheit"
dbURL = process.env.MJ_DB_URL || "postgres://mjournal@localhost/mjournal"
console.log "Creating DB engine", dbURL
gesundheit.defaultEngine = gesundheit.engine dbURL

module.exports = gesundheit
