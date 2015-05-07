var _ = require("lodash");
var bcrypt = require("bcryptjs");
var db = require("app/db");
var log = require("app/log");
var errors = require("httperrors");
var userSchema = require("../schemas").SIGN_IN;

function hashPassword(cleartext, callback) {
  bcrypt.genSalt(10, function(error, salt) {
    if (error) {
      return callback(error);
    }
    bcrypt.hash(cleartext, salt, callback);
  });
}

function run(options, callback) {
  var valid = userSchema.validate(options);
  if (valid.error) {
    setImmediate(function() {
      callback(new errors.BadRequest(valid.error.message));
    });
    return;
  }
  var user = _.pick(options, "email");
  hashPassword(options.password, function(error, bcryptedPassword) {
    if (error) {
      callback(error);
      return;
    }
    user.bcryptedPassword = bcryptedPassword;
    user.email = user.email.toLowerCase();
    var dbOp = db("users").insert(user).returning("id");
    log.debug({
      user: user
    }, "creating user");
    dbOp.exec(function(error2, rows) {
      if (error2 && /unique/i.test(error2.message)) {
        var upError = new errors.Conflict("That email is already registered");
        callback(upError);
        return;
      }
      if (error2) {
        callback(error2);
        return;
      }
      user.id = rows[0];
      delete user.bcryptedPassword;
      callback(error2, user);
    });
  });
}

module.exports = run;
