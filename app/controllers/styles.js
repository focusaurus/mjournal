var fs = require("fs");
var log = require("app/log");
var paths = require("app/paths");
var stylus = require("stylus");

function render(callback) {
  fs.readFile(paths.app + "/app.styl", "utf8", function(error, stylusText) {
    if (error) {
      return callback(error);
    }
    stylus.render(stylusText, callback);
  });
}

function main() {
  render(function(error, cssText) {
    if (error) {
      return console.error(error);
    }
    console.log(cssText);
  });
}

function appCSS(req, res, next) {
  render(function(error, cssText) {
    if (error) {
      log.error({
        err: error
      }, "Error rendering CSS");
      next("Error rendering CSS");
      return;
    }
    res.type("css");
    res.send(cssText);
  });
};

function setup(app) {
  app.get("/app.css", appCSS);
}

if (require.main === module) {
  main();
}

module.exports = setup;
