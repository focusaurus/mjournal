var _ = require("lodash");
var bodyParser = require("body-parser");
var config = require("config3");
var express = require("express");
var signInOp = require("app/users/operations/sign-in");

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

var app = express();
app.set("view engine", "jade");
app.set("views", __dirname);
app.post("/sign-in", bodyParser(), signIn);
app.get("/sign-out", signOut);

module.exports = app;
