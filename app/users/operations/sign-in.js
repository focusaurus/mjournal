var _ = require("lodash");
var bcrypt = require("bcrypt");
var db = require("app/db");
var log = require("app/log");

function run(options, callback) {
  function denied() {
    log.debug({
      email: options.email
    }, "user sign-in denied");
    return callback({
      code: 403,
      message: "Please check your email/password and try again"
    });
  }
  var user = _.extend({email: ""}, _.pick(options, "email"));
  user.email = user.email.toLowerCase().trim();
  var dbOp = db.select("users", ["id", "bcryptedPassword", "email"]).where(user).limit(1);
  dbOp.execute(function(error, result) {
    if (error) {
      return callback(error);
    }
    if (!result.rowCount) {
      return denied();
    }
    var row = result.rows[0];
    bcrypt.compare(options.password, row.bcryptedPassword, function(error, match) {
      if (error) {
        return callback(error);
      }
      if (!match) {
        return denied();
      }
      var user = _.pick(row, "id", "email");
      return callback(null, user);
    });
  });
}

module.exports = run;
