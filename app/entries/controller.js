var api, bodyParser, createEntry, express, needUser, ops, setup, updateEntry, viewEntries, _;
var _ = require("lodash");
var api = require("app/api");
var ops = require("app/entries/operations");
var express = require("express");
var needUser = require("app/middleware/needUser");
var bodyParser = express.bodyParser();

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
};

function createEntry(req, res) {
  var options = _.pick(req.body, "body", "tags");
  options.user = req.user;
  return ops.create(options, api.sendResult(res));
};

function updateEntry(req, res) {
  var options = _.pick(req.body, "body", "tags");
  options.id = req.params.id;
  options.user = req.user;
  return ops.update(options, api.sendResult(res));
};

function setup(app) {
  app.get("/entries", needUser, viewEntries);
  app.post("/entries", needUser, bodyParser, createEntry);
  app.put("/entries/:id", needUser, bodyParser, updateEntry);
};

module.exports = setup;
