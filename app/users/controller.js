var _ = require("lodash");
var config = require("config3");
var express = require("express");
var pg = require("pg");
var PGStore = require("connect-pg-simple")(express);
var signInOp = require("app/users/operations/sign-in");

var store = new PGStore({
  conString: config.dbUrl,
  pg: pg
});

function signIn(req, res) {
  var options = _.pick(req.body, "email", "password");
  signInOp(options, function(error, user) {
    if (error) {
      res.render("sign-in", {
        error: error
      });
      return;
    }
    req.session.user = req.user = user;
    res.redirect("/");
  });
}

function signOut(req, res) {
  req.session.destroy();
  return res.redirect("/");
}

function setup(app) {
  app.use(express.cookieParser());
  app.use(express.session({
    store: store,
    secret: config.sessionSecret
  }));
  app.use(function(req, res, next) {
    res.locals.user = req.user = req.session.user;
    next();
  });
  app.post("/users/sign-in", express.bodyParser(), signIn);
  app.get("/users/sign-out", signOut);
}

module.exports = setup;
