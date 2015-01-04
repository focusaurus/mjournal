#!/usr/bin/env node
var _ = require("lodash");
var config = require("config3");
var emails = require("app/emails");
var mustache = require("mustache");
var dailySummary = require("app/reports/dailySummary");

var BODY = [
  "Entries Today: {{entriesToday}}",
  "Total Entries: {{totalEntries}}",
  "Total Users: {{totalUsers}}",
  "Users Today: {{usersToday}}"
  ].join("\n");
var SUBJECT = "{{appName}} daily summary {{for}}: {{totalUsers}} users";

function build(callback) {
  dailySummary(function (error, result) {
    if (error) {
      callback(error);
      return;
    }
    if (result.entriesToday < 1) {
      callback(new Error("Not enough activity to warrant email"));
      return;
    }
    _.extend(result, _.pick(config, "appName"));
    var email = {
      to: config.email.to,
      from: config.email.from,
      subject: mustache.render(SUBJECT, result),
      text: mustache.render(BODY, result)
    };
    callback(null, email);
  });
}

function send(callback) {
  build(function (error, email) {
    if (error) {
      callback(error);
      return;
    }
    emails.send(email, callback);
  });
}

module.exports = send;
if (require.main === module) {
  send(function () {
    setTimeout(process.exit, 200);
  });
}
