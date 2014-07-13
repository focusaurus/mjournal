var _ = require("lodash");
var bcrypt = require("bcrypt");
var db = require("app/db");
var log = require("app/log");
var errors = require("app/errors");

function hashPassword(cleartext, callback) {
  bcrypt.genSalt(10, function(error, salt) {
    if (error) {
      return callback(error);
    }
    bcrypt.hash(cleartext, salt, callback);
  });
}

function isValidEmail(value) {
  return typeof value === "string" && value.indexOf("@") > 0;
}

function run(options, callback) {
  var user = _.pick(options, "email");
  if (!isValidEmail(user.email)) {
    callback(new errors.ClientError("invalid email"));
    return;
  }
  hashPassword(options.password, function(error, bcryptedPassword) {
    if (error) {
      return callback(error);
    }
    user.bcryptedPassword = bcryptedPassword;
    var dbOp = db.insert("users", user).returning("id");
    log.debug({
      user: user
    }, "creating user");
    dbOp.execute(function(error, result) {
      if (error && /unique/i.test(error.message)) {
        return callback({
          code: 409,
          message: "That email is already registered"
        });
      }
      if (error) {
        return callback(error);
      }
      user.id = result.rows[0].id;
      delete user.bcryptedPassword;
      callback(error, user);
    });
  });
}

module.exports = run;
