#!/usr/bin/env node
'use strict'

const _ = require('lodash')
const config = require('config3')
const log = require('../log')
const emails = require('./')
const mustache = require('mustache')
const dailySummary = require('../reports/daily-summary')

const BODY = [
  'Entries Created Today: {{entriesCreated}}',
  'Entries Updated Today: {{entriesUpdated}}',
  'Total Entries: {{totalEntries}}',
  'Total Users: {{totalUsers}}',
  'New Users Today: {{usersCreated}}'
].join('\n')
const SUBJECT = '{{MJ_APP_NAME}} daily summary {{for}}: {{usersCreated}} new users' // eslint-disable-line max-len

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
    _.extend(result, _.pick(config, 'MJ_APP_NAME'))
    const email = {
      to: config.MJ_EMAIL_TO,
      from: config.MJ_EMAIL_FROM,
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
