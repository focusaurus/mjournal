#!/usr/bin/env node
var _ = require("lodash");
var config = require("config3");
var log = require("app/log");
var mustache = require("mustache");
var nodemailer = require("nodemailer");
var reports = require("app/reports");
var xoauth2 = require("xoauth2");
var BODY = "Entries Today: {{entriesToday}}\n" +
  "Total Entries: {{totalEntries}}\n" +
  "Total Users: {{totalUsers}}\n";
var SUBJECT = "{{appName}} daily report: {{totalUsers}} users";
var generator = xoauth2.createXOAuth2Generator(config.email.auth.xoauth2);
var options = _.clone(config.email);
options.auth.xoauth2 = generator;
var transport = nodemailer.createTransport(config.email);

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
    log.debug(email, "Sending daily summary report email");
    transport.sendMail(email, function (error, result) {
      if (error) {
        log.error(error, "error sending daily summary report email");
        return;
      }
      log.debug(result, "daily summary report email sent OK");
    });
  });
}

module.exports = send;
if (require.main === module) {
  send(_.noop);
}
