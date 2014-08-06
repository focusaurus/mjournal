var config = require("config3");
var bole = require("bole");
bole.output({
  level: "debug",
  stream: config.logStream
});

module.exports = bole(config.pack.name);
