var _ = require("lodash");
var db = require("app/db");
var log = require("app/log");
var errors = require("httperrors");
var userSchema = require("../schemas").UPDATE;

function run(options, callback) {
  var valid = userSchema.validate(options);
  if (valid.error) {
    setImmediate(function() {
      callback(new errors.BadRequest(valid.error.message));
    });
    return;
  }
  var user = _.pick(options, "email", "theme");
  var dbOp = db("users").update(user).where({id: options.id});
  log.debug({
    user: user
  }, "updating user");
  dbOp.exec(function(error) {
    if (error && /unique/i.test(error.message)) {
      var upError = new errors.Conflict(
        "That email belongs to another account");
      callback(upError);
      return;
    }
    if (error) {
      callback(error);
      return;
    }
    user.id = options.id;
    callback(error, user);
  });
}

module.exports = run;
