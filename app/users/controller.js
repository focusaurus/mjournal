var _ = require("lodash");
var express = require("express");
var signInOp = require("app/users/operations/sign-in");

function home(req, res) {
  if (req.user) {
    res.render("home");
  } else {
    res.render("sign-in");
  }
}

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
    secret: 'HkpYsNTjVpXz6BthO8hN'
  }));
  app.use(function(req, res, next) {
    res.locals.user = req.user = req.session.user;
    next();
  });
  app.get("/", home);
  app.post("/users/sign-in", express.bodyParser(), signIn);
  app.get("/users/sign-out", signOut);
}

module.exports = setup;
