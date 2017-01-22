'use strict'

function delay (req, res, next) {
  setTimeout(() => next(), 1200)
}

module.exports = delay
