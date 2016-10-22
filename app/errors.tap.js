'use strict'
const tap = require('tap')
const errors = require('./errors')

tap.tearDown(process.exit)

tap.ok(errors.canWithstand({code: '57P01'}))
tap.ok(errors.canWithstand({code: 'EHOSTUNREACH'}))
tap.ok(errors.canWithstand({code: 'ECONNREFUSED'}))
tap.ok(errors.canWithstand({code: 'ETIMEDOUT'}))
tap.ok(errors.canWithstand({code: 'ECONNRESET'}))
tap.notOk(errors.canWithstand({code: 'ESOMETHINGELSE'}))

tap.equal(true, errors.onUncaughtException({code: 'ETIMEDOUT'}))
