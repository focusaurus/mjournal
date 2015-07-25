var _ = require('lodash')
var async = require('async')
var db = require('app/db')
var moment = require('moment')

function count (table, callback) {
  db(table).count().exec(function (error, result) {
    if (error) {
      callback(error)
      return
    }
    callback(null, result[0].count)
  })
}

function createdBetween (table, start, end, callback) {
  db(table)
    .count()
    .whereBetween('created', [start.toDate(), end.toDate()])
    .exec(function (error, result) {
      if (error) {
        callback(error)
        return
      }
      callback(null, result[0].count)
    })
}

function updatedBetween (table, start, end, callback) {
  db(table)
    .count()
    .whereBetween('updated', [start.toDate(), end.toDate()])
    .exec(function (error, result) {
      if (error) {
        callback(error)
        return
      }
      callback(null, result[0].count)
    })
}

function dailySummary (callback) {
  // Yesterday midnight UTC
  var start = moment.utc().subtract(1, 'day').startOf('day')
  var end = start.clone().endOf('day')
  var work = {
    totalUsers: count.bind(null, 'users'),
    totalEntries: count.bind(null, 'entries'),
    usersCreated: createdBetween.bind(null, 'users', start, end),
    entriesCreated: createdBetween.bind(null, 'entries', start, end),
    entriesUpdated: updatedBetween.bind(null, 'entries', start, end)
  }
  async.parallel(work, function (error, result) {
    if (error) {
      callback(error)
      return
    }
    result = _.mapValues(result, function (string) {
      return parseInt(string, 10)
    })
    result.for = start.format('MMM DD YYYY')
    callback(null, result)
  })
}

module.exports = dailySummary
