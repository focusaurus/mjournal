var _ = require("lodash");
var api = require("app/api");
var ops = require("app/entries/operations");
var express = require("express");
var needUser = require("app/middleware/needUser");
var json = require("body-parser").json();

function viewEntries(req, res) {
  if (req.user) {
    var options = _.pick(req.query, "page", "before", "textSearch");
    options.user = req.user;
    ops.view(options, api.sendResult(res));
  } else {
    res.render("home");
  }
}

function createEntry(req, res) {
  var options = _.pick(req.body, "body", "tags");
  options.user = req.user;
  return ops.create(options, api.sendResult(res));
}

function updateEntry(req, res) {
  var options = _.pick(req.body, "body", "tags");
  options.id = req.params.id;
  options.user = req.user;
  return ops.update(options, api.sendResult(res));
}

function viewTags(req, res) {
  return ops.viewTags({user: req.user}, api.sendResult(res));
}

var app = express();
app.set("view engine", "jade");
app.set("views", __dirname);
app.get("/", needUser, viewEntries);
app.post("/", needUser, json, createEntry);
app.put("/:id", needUser, json, updateEntry);
app.get("/tags", needUser, viewTags);

module.exports = app;
