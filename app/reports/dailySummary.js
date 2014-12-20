var async = require("async");
var db = require("app/db");
var moment = require("moment");

function count(table, callback) {
  db(table).count().exec(function (error, result) {
    if (error) {
      callback(error);
      return;
    }
    callback(null, result[0].count);
  });
}

function createdBetween(table, start, end, callback) {
  db(table)
    .count()
    .whereBetween("created", [start.toDate(), end.toDate()])
    .exec(function (error, result) {
    if (error) {
      callback(error);
      return;
    }
    callback(null, result[0].count);
  });
}

function dailySummary(callback) {
  var start = moment.utc().startOf("day");
  var end = start.clone().endOf("day");
  var work = {
    totalUsers: count.bind(null, "users"),
    totalEntries: count.bind(null, "entries"),
    // usersToday: createdBetween.bind(null, "users", start, end),
    entriesToday: createdBetween.bind(null, "entries", start, end)
  };
  async.parallel(work, function (error, result) {
    if (error) {
      callback(error);
      return;
    }
    result.for = start.format("MMM DD YYYY");
    callback(null, result);
  });
}

module.exports = dailySummary;
