var _ = require("lodash");
var json = require("body-parser").json();
var express = require("express");
var signInOp = require("app/users/operations/sign-in");

function signIn(req, res) {
  var options = _.pick(req.body, "email", "password");
  signInOp(options, function(error, user) {
    if (error) {
      res.status(403);
      res.send({
        error: error.message
      });
      return;
    }
    req.session.user = req.user = user;
    res.status(200).send("");
  });
}

function signOut(req, res) {
  req.session.destroy();
  res.redirect("/");
}

var app = express();
app.set("view engine", "jade");
app.set("views", __dirname);
app.post("/users/sign-in", json, signIn);
app.get("/users/sign-out", signOut);

module.exports = app;
