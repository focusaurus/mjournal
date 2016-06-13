#!/usr/bin/env node
var _ = require('lodash')
var config = require('config3')
var log = require('./log')
var emails = require('.')
var mustache = require('mustache')
var dailySummary = require('../../reports/dailySummary')

var BODY = [
  'Entries Created Today: {{entriesCreated}}',
  'Entries Updated Today: {{entriesUpdated}}',
  'Total Entries: {{totalEntries}}',
  'Total Users: {{totalUsers}}',
  'New Users Today: {{usersCreated}}'
].join('\n')
var SUBJECT = '{{appName}} daily summary {{for}}: {{usersCreated}} new users'

function build (callback) {
  dailySummary(function (error, result) {
    if (error) {
      callback(error)
      return
    }
    if (result.usersCreated < 1) {
      log.info('Daily summary report ran but no new users so no email')
      callback(new Error('Not enough activity to warrant email'))
      return
    }
    _.extend(result, _.pick(config, 'appName'))
    var email = {
      to: config.email.to,
      from: config.email.from,
      subject: mustache.render(SUBJECT, result),
      text: mustache.render(BODY, result)
    }
    callback(null, email)
  })
}

function send (callback) {
  build(function (error, email) {
    if (error) {
      callback(error)
      return
    }
    emails.send(email, callback)
  })
}

module.exports = send
if (require.main === module) {
  send(function () {
    setTimeout(process.exit, 200)
  })
}
