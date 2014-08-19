var _ = require("lodash");
var bcrypt = require("bcrypt");
var db = require("app/db");
var log = require("app/log");
var errors = require("app/errors");

function run(options, callback) {
  var defaultError = new errors.Forbidden(
    "Please check your email/password and try again"
  );
  function denied(error) {
    log.debug({
      email: options.email
    }, "user sign-in denied");
    callback(error || defaultError);
  }
  var user = _.pick(options, "email", "password");
  if (_.keys(user).length !== 2) {
    var error = new errors.BadRequest("email and password are required");
    denied(error);
    return;
  }
  user.email = user.email.toLowerCase().trim();
  var dbOp = db("users").select(["id", "bcryptedPassword", "email"])
    .where({email: user.email}).limit(1);
  dbOp.exec(function(error, rows) {
    if (error) {
      callback(error);
      return;
    }
    var row = rows[0];
    if (!row) {
      denied();
      return;
    }
    bcrypt.compare(
        options.password, row.bcryptedPassword, function(error, match) {
      if (error) {
        callback(error);
        return;
      }
      if (!match) {
        denied();
        return;
      }
      var user = _.pick(row, "id", "email");
      callback(null, user);
    });
  });
}

module.exports = run;
