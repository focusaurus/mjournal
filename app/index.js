var bmw = require("browserify-middleware");
var config = require("config3");
var express = require("express");
var log = require("app/log");
var paths = require("app/paths");

var stylusBundle = require("app/site/stylusBundle");
var app = express();

function home(req, res) {
  if (req.user) {
    res.render("home");
  } else {
    res.render("sign-in");
  }
}

function appCSS(req, res, next) {
  stylusBundle(function(error, cssText) {
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
}

app.set("view engine", "jade");
app.set("views", paths.views);
app.router;
app.get("/", home);
app.get("/mjournal.css", appCSS);
app.get("/mjournal.js", bmw([{"app/browser/main": {"add": true}}]));
app.use(express.static(paths.wwwroot));
app.use(express.static(paths.browser));
[
  "app/users/controller",
  "app/entries/controller"
].forEach(function(controller) {
  require(controller)(app);
});
app.use(app.router);

module.exports = app;
