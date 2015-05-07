var bole = require("bole");
var config = require("config3");

bole.output({
  level: "debug",
  stream: config.logStream
});

module.exports = bole(config.pack.name);
