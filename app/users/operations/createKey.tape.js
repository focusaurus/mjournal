var createKey = require('./createKey')
var redeemKey = require('./redeemKey')
var signUp = require('./signUp')
var test = require('prova')

var group = 'users/operations/createKey'
test(group + ' should require a user option', function (assert) {
  createKey({}, function (error) {
    assert.ok(error)
    assert.equal(error.status, 401)
    assert.end()
  })
})

var user
var firstKey

test(group + ' should create a key that can be redeemed', function (assert) {
  var options = {email: 'createKey@example.com', password: 'password'}
  signUp(options, function (error, result) {
    assert.error(error)
    user = result
    createKey({user: user}, function (error, value) {
      assert.error(error)
      assert.ok(/[a-z0-9]{20}/i.test(value))
      firstKey = value
      redeemKey({key: firstKey}, function (error2, result) {
        assert.error(error2)
        assert.equal(result.email, 'createkey@example.com')
        assert.end()
      })
    })
  })
})

test(group + ' should invalidate existing keys', function (assert) {
  createKey({user: user}, function (error) {
    assert.error(error)
    redeemKey({key: firstKey}, function (error2, user2) {
      assert.error(error2)
      assert.notOk(user2)
      assert.end()
    })
  })
})
