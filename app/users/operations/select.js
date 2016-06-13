var db = require('../../db')
var clientFields = require('./clientFields')

function select (run, callback) {
  db('users').select(clientFields).where('id', run.options.user.id)
    .exec(function (error, rows) {
      if (error) {
        callback(error)
        return
      }
      run.user = rows && rows[0]
      callback()
    })
}

module.exports = select
