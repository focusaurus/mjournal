var redeemKey = require('./operations/redeemKey')

function byKey (req, res, next) {
  if (req.user) {
    next()
    return
  }
  var auth = req.get('Authorization')
  if (!auth) {
    next()
    return
  }
  var prefix = 'key '
  if (auth.slice(0, prefix.length) !== prefix) {
    next()
    return
  }
  var key = auth.slice(prefix.length)
  redeemKey({key: key}, function (error, user) {
    if (error) {
      next(error)
      return
    }
    res.locals.user = req.user = user
    next()
  })
}

module.exports = byKey
