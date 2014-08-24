var _ = require("lodash");
var express = require("express");
var json = require("body-parser").json();
var log = require("app/log");
var operations = require("./operations");

function respond(res) {
  return function _respond(error, user) {
    if (error) {
      res.status(error.status || 403).send(error);
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
  operations.signIn(options, respond(res));
}

function signUp(req, res) {
  var options = _.pick(req.body, "email", "password");
  res.status(201);
  operations.signUp(options, respond(res));
}

function signOut(req, res) {
  req.session.destroy(function (error) {
    if (error) {
      log.error(error, "session.destroy failed");
    }
    res.redirect("/");
  });
}

function createToken(req, res, next) {
  var options = {
    user: req.user
  };
  res.status(201);
  operations.createToken(options, function (error, result) {
    if (error) {
      next(error);
      return;
    }
    res.json({value: result});
  });
}

var app = express();
app.post("/sign-in", json, signIn);
app.post("/sign-up", json, signUp);
app.get("/sign-out", signOut);
app.post("/token", createToken);

module.exports = app;
