var bunyan = require("bunyan");
var level = process.env.NODE_ENV === "test" ? "fatal" : "debug";
var log = bunyan.createLogger({
  name: "mjournal",
  level: level,
  serializers: bunyan.stdSerializers
});

module.exports = log;
