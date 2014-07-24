var _ = require("lodash");
var json = require("body-parser").json();
var express = require("express");
var signInOp = require("app/users/operations/sign-in");
var signUpOp = require("app/users/operations/sign-up");

function respond(res) {
  return function _respond(error, user) {
    if (error) {
      res.status(error.code || 403);
      res.send(error);
      return;
    }
    res.req.session.user = res.req.user = user;
    res.send(user);
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
  req.session.destroy();
  res.redirect("/");
}

var app = express();
app.set("view engine", "jade");
app.set("views", __dirname);
app.post("/users/sign-in", json, signIn);
app.post("/users/sign-up", json, signUp);
app.get("/users/sign-out", signOut);

module.exports = app;
