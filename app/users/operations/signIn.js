var _ = require("lodash");
var bcrypt = require("bcryptjs");
var db = require("app/db");
var errors = require("httperrors");
var log = require("app/log");
var userSchema = require("./userSchema");

function run(options, callback) {
  var valid = userSchema.validate(options);
  if (valid.error) {
    callback(new errors.BadRequest(valid.error.message));
    return;
  }
  var defaultError = new errors.Forbidden(
    "Please check your email/password and try again"
  );
  function denied(error) {
    log.debug({
      email: options.email
    }, "user sign-in denied");
    callback(error || defaultError);
  }
  options.email = options.email.toLowerCase().trim();
  db("users").select(["id", "bcryptedPassword", "email"])
    .where({email: options.email}).limit(1).exec(function(error, rows) {
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
