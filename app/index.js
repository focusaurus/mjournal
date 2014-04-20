var browserifyBundle = require("app/site/browserifyBundle");
var config = require("config3");
var express = require("express");
var log = require("app/log");
var paths = require("app/paths");
var pg = require("pg");
var PGStore = require("connect-pg-simple")(express);
var stylusBundle = require("app/site/stylusBundle");

var app = express();
var store = new PGStore({
  conString: config.dbUrl,
  pg: pg
});

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
app.use(express.cookieParser());
app.use(express.session({
  store: store,
  secret: "izd7eT6WHsPD"
}));
app.get("/sign-out", function(req, res) {
  req.session.destroy();
  res.redirect("/");
});
app.get("/mjournal.css", appCSS);
app.get("/mjournal.js", function (req, res) {
  res.type("js");
  browserifyBundle().pipe(res);
});
app.use(express.static(paths.wwwroot));
app.use(express.static(paths.browser));
[
  "app/users/controller",
  "app/entries/controller"
].forEach(function(controller) {
  require(controller)(app);
});

module.exports = app;
