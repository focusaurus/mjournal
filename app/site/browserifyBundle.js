#!/usr/bin/env node
var bundle = require("browserify")();
var concat = require("concat-stream");
var config = require("config3");
var log = require("app/log");
var paths = require("app/paths");

function build() {
  log.debug("rebuilding browserify bundle");
  return bundle.bundle({debug: config.browserifyDebug});
}

function cache() {
  build().pipe(concat(function(buffer) {
    module.exports.prebuiltCache = buffer;
  }));
}

if (config.browserifyDebug) {
  bundle = require("watchify")();
  bundle.on("update", cache);
}

[
  "angular",
  "angular-resource"
].forEach(function (expose) {
  bundle.require(
    paths.thirdParty + "/" + expose + ".js",
    {expose: expose}
  );
});
bundle.transform("brfs");
bundle.add("app/browser/main");

if (require.main === module) {
  //don't contaminate our output with log messages
  log.level("fatal");
  build().pipe(process.stdout);
} else if (config.browserifyPrebuild) {
  cache();
}

module.exports = build;
