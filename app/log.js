var bole = require("bole");
var config = require("config3");
var fs = require("fs");

var logStream = config.logStream;
if (typeof logStream === "string") {
  var logOptions = {
    encoding: "utf8",
    flags: "a",
    mode: 640
  };
  logStream = fs.createWriteStream(config.logStream, logOptions);
  logStream.on("error", function (error) {
    console.error("Error writing logs to disk", error);
  });
}

bole.output({
  level: "debug",
  stream: logStream
});

module.exports = bole(config.pack.name);
