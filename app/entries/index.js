var _ = require("lodash");
var api = require("app/api");
var ops = require("app/entries/operations");
var express = require("express");
var needUser = require("app/middleware/needUser");
var bodyParser = require("body-parser");

function viewEntries(req, res) {
  if (req.user) {
    var options = {
      user: req.user,
      page: req.query.page,
      textSearch: req.query.textSearch
    };
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

var app = express();
app.set("view engine", "jade");
app.set("views", __dirname);
app.get("/", needUser, viewEntries);
app.post("/", needUser, bodyParser, createEntry);
app.put("/:id", needUser, bodyParser, updateEntry);

module.exports = app;