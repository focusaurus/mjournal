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
    setImmediate(function() {
      callback(new errors.BadRequest("invalid email"));
    });
    return;
  }
  if (!options.password) {
    setImmediate(function() {
      callback(new errors.BadRequest("password is required"));
    });
    return;
  }
  hashPassword(options.password, function(error, bcryptedPassword) {
    if (error) {
      callback(error);
      return;
    }
    user.bcryptedPassword = bcryptedPassword;
    var dbOp = db("users").insert(user).returning("id");
    log.debug({
      user: user
    }, "creating user");
    dbOp.exec(function(error, rows) {
      if (error && /unique/i.test(error.message)) {
        var upError = new errors.Conflict("That email is already registered");
        callback(upError);
        return;
      }
      if (error) {
        callback(error);
        return;
      }
      user.id = rows[0];
      delete user.bcryptedPassword;
      callback(error, user);
    });
  });
}

module.exports = run;
