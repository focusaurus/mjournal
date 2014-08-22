var _ = require("lodash");
var express = require("express");
var json = require("body-parser").json();
var log = require("app/log");
var signInOp = require("app/users/operations/sign-in");
var signUpOp = require("app/users/operations/sign-up");

function respond(res) {
  return function _respond(error, user) {
    if (error) {
      res.status(error.status || 403);
      res.send(error);
      return;
    }
    var session = res.req.session;
    session.user = res.req.user = user;
    session.save(function (error) {
      if (error) {
        log.error(error, "session.save failed");
        return;
      }
      res.send(user);
    });
  };
}

function signIn(req, res) {
  var options = _.pick(req.body, "email", "password");
  signInOp(options, respond(res));
}

function signUp(req, res) {
  var options = _.pick(req.body, "email", "password");
  res.status(201);
  signUpOp(options, respond(res));
}

function signOut(req, res) {
  req.session.destroy(function (error) {
    if (error) {
      log.error(error, "session.destroy failed");
      return;
    }
    res.redirect("/");
  });
}

var app = express();
app.set("view engine", "jade");
app.set("views", __dirname);
app.post("/users/sign-in", json, signIn);
app.post("/users/sign-up", json, signUp);
app.get("/users/sign-out", signOut);

module.exports = app;
