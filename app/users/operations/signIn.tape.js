var test = require('tape')
var signIn = require('app/users/operations/signIn')
var signUp = require('app/users/operations/signUp')

var group = 'users/operations/signIn'
var newUser = {
  email: 'test/users/operations/signIn@example.com',
  password: 'password'
}

test(group + 'setup', function (assert) {
  signUp(newUser, assert.end.bind(assert))
})

test(
  group + ' should return the user if password is correct', function (assert) {
  signIn(newUser, function (error, user) {
    assert.error(error)
    assert.ok(user.id)
    assert.ok(user.email)
    assert.notOk(user.bcryptedPassword)
    assert.equal(user.email, newUser.email.toLowerCase())
    assert.end()
  })
})

test(group + ' should fail with incorrect password', function (assert) {
  signIn({
    email: newUser.email,
    password: 'incorrect'
  }, function (error) {
    assert.equal(error.status, 403)
    assert.end()
  })
})
