'use strict'
const tap = require('tap')

tap.tearDown(process.exit)

const signUp = require('./sign-up')
const update = require('./update')

tap.test('should update email and theme', (test) => {
  const newUser = {
    email: 'test/users/operations/update@example.com',
    password: 'password'
  }
  signUp(newUser, function (error, user) {
    test.error(error)
    test.ok(user.id)
    const changes = {
      user: user,
      email: 'test/users/operations/update2@example.com',
      theme: 'hoth'
    }
    update(changes, function (error2, updatedUser) {
      test.error(error2)
      test.equal(updatedUser.theme, 'hoth')
      test.end()
    })
  })
})
