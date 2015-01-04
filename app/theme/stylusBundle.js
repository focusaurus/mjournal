#!/usr/bin/env node
var config = require("config3");
var fs = require("fs");
var join = require("path").join;
var paths = require("app/paths");
var stylus = require("stylus");
var theme = require("app/theme");
var errors = require("httperrors");

function render(name, callback) {
  name = name || theme.defaultTheme.name;
  if (theme.names.indexOf(name) < 0) {
    callback(new errors.NotFound("No theme named " + name));
    return;
  }
  var stylPath = join(paths.app, "theme", name, "app.styl");
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
