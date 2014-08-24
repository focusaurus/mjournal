var _ = require("lodash");
var api = require("app/api");
var operations = require("./operations");
var express = require("express");
var needUser = require("app/middleware/needUser");
var json = require("body-parser").json();

function viewEntries(req, res) {
  var options = _.pick(req.query, "page", "after", "before", "textSearch");
  options.user = req.user;
  operations.view(options, api.sendResult(res));
}

function createEntry(req, res) {
  var options = _.pick(req.body, "body", "tags");
  options.user = req.user;
  operations.create(options, api.sendResult(res));
}

function updateEntry(req, res) {
  var options = _.pick(req.body, "body", "tags");
  options.id = req.params.id;
  options.user = req.user;
  operations.update(options, api.sendResult(res));
}

function viewTags(req, res) {
  operations.viewTags({user: req.user}, api.sendResult(res));
}

var app = express();
app.route("/")
  .get(viewEntries)
  .post(needUser, json, createEntry);
app.put("/:id", needUser, json, updateEntry);
app.get("/tags", needUser, viewTags);

module.exports = app;
