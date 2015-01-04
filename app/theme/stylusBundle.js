#!/usr/bin/env node
var config = require("config3");
var fs = require("fs");
var join = require("path").join;
var paths = require("app/paths");
var stylus = require("stylus");


function render(theme, callback) {
  var stylPath = join(paths.app, "theme", theme || "moleskine", "app.styl");
  fs.readFile(stylPath, "utf8", function(error, stylusText) {
    if (error) {
      return callback(error);
    }
    stylus(stylusText)
      .include(paths.app)
      .include(paths.bower)
      .include(paths.wwwroot)
      .set("include css", true)
      .set("filename", stylPath)
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
