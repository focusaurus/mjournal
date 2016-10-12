'use strict'

const tap = require('tap')

tap.tearDown(process.exit)

const createKey = require('./create-key')
const redeemKey = require('./redeem-key')
const signUp = require('./sign-up')

tap.test('should require a user option', function (test) {
  createKey({}, function (error) {
    test.ok(error)
    test.equal(error.status, 401)
    test.end()
  })
})

let user
let firstKey

tap.test('should create a key that can be redeemed', function (test) {
  const options = {email: 'createKey@example.com', password: 'password'}
  signUp(options, function (error, result) {
    test.error(error)
    user = result
    createKey({user: user}, function (error, value) {
      test.error(error)
      test.ok(/[a-z0-9]{20}/i.test(value))
      firstKey = value
      redeemKey({key: firstKey}, function (error2, result) {
        test.error(error2)
        test.equal(result.email, 'createkey@example.com')
        test.end()
      })
    })
  })
})

tap.test('should invalidate existing keys', function (test) {
  createKey({user: user}, function (error) {
    test.error(error)
    redeemKey({key: firstKey}, function (error2, user2) {
      test.error(error2)
      test.notOk(user2)
      test.end()
    })
  })
})
