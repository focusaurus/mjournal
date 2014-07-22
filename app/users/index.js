var _ = require("lodash");
var urlencoded = require("body-parser").urlencoded();
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
app.post("/users/sign-in", urlencoded, signIn);
app.get("/users/sign-out", signOut);

module.exports = app;
