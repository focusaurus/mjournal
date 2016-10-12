'use strict'

const redeemKey = require('./operations/redeem-key')

function byKey (req, res, next) {
  if (req.user) {
    next()
    return
  }
  const auth = req.get('Authorization')
  if (!auth) {
    next()
    return
  }
  const prefix = 'key '
  if (auth.slice(0, prefix.length) !== prefix) {
    next()
    return
  }
  const key = auth.slice(prefix.length)
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
