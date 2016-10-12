'use strict'
const tap = require('tap')

tap.tearDown(process.exit)

const signUp = require('./sign-up')

tap.test('should create a user.id and not return the password', (test) => {
  const newUser = {
    email: 'test/users/operations/sign-up@example.com',
    password: 'password'
  }
  signUp(newUser, function (error, user) {
    test.error(error)
    test.notOk(user.bcryptedPassword)
    test.ok(user.id)
    test.ok(user.email)
    test.equal(user.email, newUser.email.toLowerCase())
    test.end()
  })
})

tap.test('should prevent duplicate emails', (test) => {
  const newUser = { email: 'dupe@example.com',
    password: 'password'
  }
  signUp(newUser, function (error) {
    test.error(error)
    signUp(newUser, function (error2) {
      test.equal(error2.status, 409)
      test.end()
    })
  })
})

tap.test('should require a valid-ish email address', (test) => {
  const newUser = { email: 'no_at_sign_at_example.com',
    password: 'password'
  }
  signUp(newUser, function (error) {
    test.equal(error.status, 400)
    test.end()
  })
})
