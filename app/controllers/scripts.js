#!/usr/bin/env node
var paths = require("app/paths");
var bundle = require("browserify")();
var config = require("app/config");

bundle.require(
  paths.thirdParty + "/angular/angular.js",
  {expose: "angular"}
);
bundle.require(
  paths.thirdParty + "/angular/angular-resource.js",
  {expose: "angular-resource"}
);
bundle.add("app/browser/main");
function getStream(callback) {
  return bundle.bundle({debug: config.browserifyDebug});
}

function main() {
  getStream().pipe(process.stdout);
}

function setup(app) {
  app.get("/mjournal.js", function (req, res) {
    res.type("js");
    getStream().pipe(res);
  });
}

if (require.main === module) {
  main();
}

module.exports = setup;
