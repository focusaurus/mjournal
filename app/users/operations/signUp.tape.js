var signUp = require('app/users/operations/signUp')
var test = require('tape')

var group = 'users/operations/signUp'

test(
  group + ' should create a user.id and not return the password',
  function (assert) {
  var newUser = {
    email: 'test/users/operations/signUp@example.com',
    password: 'password'
  }
  signUp(newUser, function (error, user) {
    assert.error(error)
    assert.notOk(user.bcryptedPassword)
    assert.ok(user.id)
    assert.ok(user.email)
    assert.equal(user.email, newUser.email.toLowerCase())
    assert.end()
  })
})

test(group + ' should prevent duplicate emails', function (assert) {
  var newUser = {
    email: 'dupe@example.com',
    password: 'password'
  }
  signUp(newUser, function (error) {
    assert.error(error)
    signUp(newUser, function (error2) {
      assert.equal(error2.status, 409)
      assert.end()
    })
  })
})

test(group + ' should require a valid-ish email address', function (assert) {
  var newUser = {
    email: 'no_at_sign_at_example.com',
    password: 'password'
  }
  signUp(newUser, function (error) {
    assert.equal(error.status, 400)
    assert.end()
  })
})
