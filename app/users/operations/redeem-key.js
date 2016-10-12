const db = require('../../db')

function redeemKey (options, callback) {
  db('users').select(['id', 'email'])
    .innerJoin('keys', 'users.id', 'keys.userId')
    .where('keys.valid', true)
    .where('keys.value', options.key)
    .exec(function (error, rows) {
      callback(error, rows && rows[0])
    })
// select ("id", "email") from "users"
// join "keys"
// on "keys"."userId" = "users"."id"
// where "keys"."value" = 'PCrgCmdF7FtEI8ua34AF'
// and "keys"."valid" is true
}

module.exports = redeemKey
