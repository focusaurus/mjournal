var bole = require("bole");
var config = require("config3");
var fs = require("fs");

var logStream = config.logStream;

if (typeof logStream === "string") {
  var logOptions = {
    encoding: "utf8",
    flags: "a",
    mode: 600
  };
  logStream = fs.createWriteStream(config.logStream, logOptions);
}
bole.output({
  level: "debug",
  stream: logStream
});

module.exports = bole(config.pack.name);
