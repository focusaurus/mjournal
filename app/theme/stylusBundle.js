#!/usr/bin/env node
var config = require("config3");
var fs = require("fs");
var paths = require("app/paths");
var stylus = require("stylus");

var APPSTYL = paths.app + "/theme/hoth/app.styl";

function render(callback) {
  fs.readFile(APPSTYL, "utf8", function(error, stylusText) {
    if (error) {
      return callback(error);
    }
    stylus(stylusText)
      .include(paths.app)
      .include(paths.bower)
      .set("include css", true)
      .set("filename", APPSTYL)
      .set("sourcemap", {inline: config.css.debug})
      .render(callback);
  });
}

function main() {
  render(function(error, cssText) {
    if (error) {
      console.error(error);
      return;
    }
    console.log(cssText);
  });
}

if (require.main === module) {
  main();
}

module.exports = render;
