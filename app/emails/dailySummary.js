#!/usr/bin/env node
var _ = require("lodash");
var config = require("config3");
var emails = require("app/emails");
var mustache = require("mustache");
var reports = require("app/reports");
var BODY = "Entries Today: {{entriesToday}}\n" +
  "Total Entries: {{totalEntries}}\n" +
  "Total Users: {{totalUsers}}\n";
var SUBJECT = "{{appName}} daily summary {{for}}: {{totalUsers}} users";

function build(callback) {
  reports.dailySummary(function (error, result) {
    if (error) {
      callback(error);
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
  send(process.exit);
}
