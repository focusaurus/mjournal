bunyan = require "bunyan"
level = if process.env.NODE_ENV is "test" then "fatal" else "debug"
log = bunyan.createLogger
  name: "mjournal"
  level: level
  serializers: bunyan.stdSerializers
module.exports = log
