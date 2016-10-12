const db = require('../db')

function dbDown (req, res, next) {
  function down () {
    res.locals.cause = 'Database is down'
    res.status(503)
    res.render('dbDown')
  }
  db.raw('select 1 as db_is_up').then(function () {
    next()
  }).catch(down)
}

module.exports = dbDown
