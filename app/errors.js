var log = require("app/log");

function canWithstand(error) {
  switch (error.code) {
    case "57P01":
      //terminating connection due to administrator command
    case "EHOSTUNREACH":
      //DB probably down at the moment
    case "ECONNREFUSED":
      //DB probably down
      log.warn(error, "Database connection error");
      return true;
    default:
      return false;
  }
}

/*eslint no-unused-vars:0*/
function middleware(error, req, res, next) {
  res.status(error.status || error.statusCode || 500);
  if (canWithstand(error)) {
    res.locals.error = "Database is down";
    res.render("dbDown");
    return;
  }
  res.locals.error = error.message;
  log.error(error, "express error handler middleware");
  res.render("error");
}

function onUncaughtException(error) {
  if (canWithstand(error)) {
    return;
  }
  var message = "Uncaught exception: process will exit";
  log.error(error, message);
  //In case log is not writeable, etc
  console.error(message, error);
  setTimeout(process.exit.bind(null, 66), 1000);
}

exports.canWithstand = canWithstand;
exports.middleware = middleware;
exports.onUncaughtException = onUncaughtException;
