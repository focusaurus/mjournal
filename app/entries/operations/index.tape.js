var _ = require('lodash')
var ops = require('app/entries/operations')
var signUp = require('app/users/operations/signUp')
var test = require('tape')

var group = 'app/entries/operations/index'

var users = []
var entries = []

function createUser (callback) {
  var email = 'test/entries/operations/create' +
    (users.length + 1) +
    '@example.com'
  var inUser = {
    email: email,
    password: 'password'
  }
  signUp(inUser, function (error, user) {
    users.push(user)
    callback(error, user)
  })
}

test(group + ' should create an entry', function (assert) {
  createUser(function (error, user) {
    assert.error(error)
    var options = {
      user: user,
      body: 'test body',
      tags: 'e1t1 e1t2'
    }
    ops.create(options, function (error, outEntry) {
      assert.error(error)
      assert.ok(outEntry.id)
      assert.ok(outEntry.created)
      assert.ok(outEntry.updated)
      assert.ok(outEntry.body)
      assert.equal(outEntry.body, options.body)
      entries.push(outEntry)
      assert.end()
    })
  })
})

test(group + ' should view the newly created entry', function (assert) {
  ops.view({
    user: users[0]
  }, function (error, entries) {
    assert.error(error)
    assert.ok(entries.length)
    assert.end()
  })
})

test(group + ' should find the entry with text search', function (assert) {
  ops.view({
    user: users[0],
    textSearch: 'body'
  }, function (error, entries) {
    assert.error(error)
    assert.ok(entries.length)
    assert.end()
  })
})

test(
  group + ' should not find the entry with non-matching text search',
  function (assert) {
    ops.view({
      user: users[0],
      textSearch: 'notpresent'
    }, function (error, entries) {
      assert.error(error)
      assert.equal(entries.length, 0)
      assert.end()
    })
  })

test(group + " should view the user's tags", function (assert) {
  ops.viewTags({
    user: users[0]
  }, function (error, tags) {
    assert.error(error)
    tags = _.map(tags, 'text')
    assert.ok(tags.indexOf('e1t1') >= 0)
    assert.ok(tags.indexOf('e1t2') >= 0)
    assert.notOk(tags.indexOf('e2t1') >= 0)
    assert.notOk(tags.indexOf('e2t2') >= 0)
    assert.equal(tags.length, 2)
    assert.end()
  })
})

test(group + ' should update an entry', function (assert) {
  var entry = entries[0]
  var options = {
    id: entries[0].id,
    user: users[0],
    body: 'test body 2'
  }
  var oldUpdated = entry.updated
  ops.update(options, function (error, outEntry) {
    assert.error(error)
    assert.equal(outEntry.body, options.body)
    assert.ok(outEntry.updated)
    assert.ok(outEntry.created)
    assert.notEqual(oldUpdated, outEntry.updated)
    assert.end()
  })
})

test(group + ' should create a 2nd entry with 2nd user', function (assert) {
  createUser(function (error, user) {
    assert.error(error)
    var options = {
      user: user,
      body: 'test body2',
      tags: 'e2t1 e2t2'
    }
    ops.create(options, function (error, outEntry) {
      assert.error(error)
      assert.ok(outEntry.id)
      assert.ok(outEntry.created)
      assert.ok(outEntry.updated)
      assert.ok(outEntry.body)
      assert.equal(outEntry.body, options.body)
      entries.push(outEntry)
      assert.end()
    })
  })
})

test(group + " should not update someone else's entry", function (assert) {
  var options = {
    id: entries[0].id,
    user: users[1],
    body: 'test body 3 hax0rz'
  }
  ops.update(options, function (error, outEntry) {
    assert.equal(error.status, 404)
    assert.notOk(outEntry)
    assert.end()
  })
})

test(group + " should not delete someone else's entry", function (assert) {
  var options = {
    id: entries[0].id,
    user: users[1]
  }
  ops.delete(options, function (error) {
    assert.equal(error.status, 404)
    assert.end()
  })
})

test(group + ' should delete an entry', function (assert) {
  var options = {
    id: entries[0].id,
    user: users[0]
  }
  ops.delete(options, assert.end.bind(assert))
})
