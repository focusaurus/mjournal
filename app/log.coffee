bunyan = require "bunyan"
log = bunyan.createLogger
  name: "mjournal"
  level: "debug"
  serializers: bunyan.stdSerializers
module.exports = log
