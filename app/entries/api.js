var _ = require("lodash");
var api = require("app/api");
var express = require("express");
var json = require("body-parser").json();
var operations = require("./operations");

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

function deleteEntry(req, res) {
  var options = _.pick(req.params, "id");
  options.user = req.user;
  operations.delete(options, function (error) {
    if (error) {
      res.status(error.statusCode || 500).send();
      return;
    }
    res.send();
  });
}

function viewTags(req, res) {
  operations.viewTags({user: req.user}, api.sendResult(res));
}

var app = express();
app.route("/")
  .get(viewEntries)
  .post(json, createEntry);
app.put("/:id", json, updateEntry);
app.delete("/:id", deleteEntry);
app.get("/tags", viewTags);

module.exports = app;
