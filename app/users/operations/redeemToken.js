var db = require("app/db");

function redeemToken(options, callback) {
  db("users").select(["id", "email"])
    .innerJoin("tokens", "users.id", "tokens.userId")
    .where("tokens.valid", true)
    .where("tokens.value", options.value)
    .exec(function (error, rows) {
      callback(error, rows && rows[0]);
    });
  // select ("id", "email") from "users"
  // join "tokens"
  // on "tokens"."userId" = "users"."id"
  // where "tokens"."value" = 'PCrgCmdF7FtEI8ua34AF'
  // and "tokens"."valid" is true;
}

module.exports = redeemToken;
