var bmw = require("browserify-middleware");
var config = require("config3");
var cookieParser = require("cookie-parser");
var errorHandler = require("app/middleware/errorHandler");
var express = require("express");
var log = require("app/log");
var paths = require("app/paths");
var pg = require("pg.js");
var session = require("express-session");
var stylusBundle = require("app/site/stylusBundle");

function home(req, res) {
  if (req.user) {
    res.render("home");
  } else {
    res.render("users/sign-in");
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

var PGStore = require("connect-pg-simple")(session);
var store = new PGStore({
  conString: config.db,
  pg: pg,
  secret: config.sessionSecret
});
var app = express();
app.set("view engine", "jade");
app.set("views", __dirname);
app.use(express.static(paths.wwwroot));
app.use(express.static(paths.browser));
app.use(cookieParser());
app.use(session({
  store: store,
  secret: config.sessionSecret
}));
app.use(function(req, res, next) {
  res.locals.user = req.user = req.session.user;
  next();
});
app.get("/", home);
app.get("/mjournal.css", appCSS);
app.get("/mjournal.js", bmw([{"app/browser": {"add": true}}]));
app.use(require("app/users"));
app.use("/api/entries", require("app/entries/api"));
app.use(errorHandler);
module.exports = app;
