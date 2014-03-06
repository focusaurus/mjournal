var _ = require("lodash");
var bcrypt = require("bcrypt");
var db = require("app/db");
var log = require("app/log");

function hashPassword(cleartext, callback) {
  bcrypt.genSalt(10, function(error, salt) {
    if (error) {
      return callback(error);
    }
    bcrypt.hash(cleartext, salt, callback);
  });
};

function run(options, callback) {
  var user = _.pick(options, "email");
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
      if (/unique/i.test(error != null ? error.message : void 0)) {
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
};

module.exports = run;
