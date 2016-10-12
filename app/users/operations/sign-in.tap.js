'use strict'
const tap = require('tap')

tap.tearDown(process.exit)

const signIn = require('./sign-in')
const signUp = require('./sign-up')

const newUser = {
  email: 'test/users/operations/sign-in@example.com',
  password: 'password'
}

tap.test('setup', (assert) => {
  signUp(newUser, assert.end.bind(assert))
})

tap.test('should return the user if password is correct', (assert) => {
  signIn(newUser, function (error, user) {
    assert.error(error)
    assert.ok(user.id)
    assert.ok(user.email)
    assert.notOk(user.bcryptedPassword)
    assert.equal(user.email, newUser.email.toLowerCase())
    assert.end()
  })
})

tap.test('should fail with incorrect password', (assert) => {
  signIn({
    email: newUser.email,
    password: 'incorrect'
  }, function (error) {
    assert.equal(error.status, 403)
    assert.end()
  })
})
