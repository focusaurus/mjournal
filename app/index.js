var _ = require("lodash");
var bmw = require("browserify-middleware");
var byKey = require("./users/byKey");
var config = require("config3");
var cookieParser = require("cookie-parser");
var errors = require("app/errors");
var express = require("express");
var log = require("app/log");
var paths = require("app/paths");
var pg = require("pg");
var session = require("express-session");
var sharify = require("sharify");
var stylusBundle = require("app/site/stylusBundle");

bmw.settings.production.minify = {mangle: false};

function home(req, res) {
  if (req.user) {
    res.render("home");
  } else {
    res.render("users/signIn");
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
var app = express();
_.extend(sharify.data, _.pick(config, "appName", "appVersion"));
sharify.data.sessionTtl = config.session.cookie.maxAge;
_.extend(app.locals, sharify.data);
app.set("view engine", "jade");
app.set("views", __dirname);
app.set("trust proxy", true);
app.use(sharify);
app.get("/mjournal.css", appCSS);
app.get("/mjournal.js", bmw([{"app/browser": {"add": true}}]));
app.use(express.static(paths.wwwroot));
app.use(express.static(paths.browser));
app.use(require("./middleware/dbDown"));
app.use(cookieParser());
app.use(session({
  store: new PGStore({conString: config.db, pg: pg}),
  secret: config.session.secret,
  cookie: config.session.cookie,
  resave: false,
  saveUninitialized: true
}));
app.use(function(req, res, next) {
  res.locals.user = req.user = req.session.user;
  next();
});
app.use(byKey);
app.get("/", home);
app.use("/api/users", require("./users/api"));
app.use("/api/entries", require("./entries/api"));
app.use(errors.middleware);
module.exports = app;
