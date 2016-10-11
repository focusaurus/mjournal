'use strict'
const _ = require('lodash')
const ops = require('.')
const signUp = require('../../users/operations/signUp')
const tap = require('tap')
tap.tearDown(process.exit)

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

tap.test('should create an entry', function (test) {
  createUser(function (error, user) {
    test.error(error)
    var options = {
      user: user,
      body: 'test body',
      tags: 'e1t1 e1t2'
    }
    ops.create(options, function (error, outEntry) {
      test.error(error)
      test.ok(outEntry.id)
      test.ok(outEntry.created)
      test.ok(outEntry.updated)
      test.ok(outEntry.body)
      test.same(outEntry.body, options.body)
      entries.push(outEntry)
      test.end()
    })
  })
})

tap.test('should view the newly created entry', function (test) {
  ops.view({
    user: users[0]
  }, function (error, entries) {
    test.error(error)
    test.ok(entries.length)
    test.end()
  })
})

tap.test('should find the entry with text search', function (test) {
  ops.view({
    user: users[0],
    textSearch: 'body'
  }, function (error, entries) {
    test.error(error)
    test.ok(entries.length)
    test.end()
  })
})

tap.test(
  'should not find the entry with non-matching text search',
  function (test) {
    ops.view({
      user: users[0],
      textSearch: 'notpresent'
    }, function (error, entries) {
      test.error(error)
      test.same(entries.length, 0)
      test.end()
    })
  })

tap.test(' should view the user\'s tags', function (test) {
  ops.viewTags({
    user: users[0]
  }, function (error, tags) {
    test.error(error)
    tags = _.map(tags, 'text')
    test.ok(tags.indexOf('e1t1') >= 0)
    test.ok(tags.indexOf('e1t2') >= 0)
    test.notOk(tags.indexOf('e2t1') >= 0)
    test.notOk(tags.indexOf('e2t2') >= 0)
    test.same(tags.length, 2)
    test.end()
  })
})

tap.test('should update an entry', function (test) {
  var entry = entries[0]
  var options = {
    id: entries[0].id,
    user: users[0],
    body: 'test body 2'
  }
  var oldUpdated = entry.updated
  ops.update(options, function (error, outEntry) {
    test.error(error)
    test.same(outEntry.body, options.body)
    test.ok(outEntry.updated)
    test.ok(outEntry.created)
    test.notEqual(oldUpdated, outEntry.updated)
    test.end()
  })
})

tap.test('should create a 2nd entry with 2nd user', function (test) {
  createUser(function (error, user) {
    test.error(error)
    var options = {
      user: user,
      body: 'test body2',
      tags: 'e2t1 e2t2'
    }
    ops.create(options, function (error, outEntry) {
      test.error(error)
      test.ok(outEntry.id)
      test.ok(outEntry.created)
      test.ok(outEntry.updated)
      test.ok(outEntry.body)
      test.same(outEntry.body, options.body)
      entries.push(outEntry)
      test.end()
    })
  })
})

tap.test(' should not update someone else\'s entry', function (test) {
  var options = {
    id: entries[0].id,
    user: users[1],
    body: 'test body 3 hax0rz'
  }
  ops.update(options, function (error, outEntry) {
    test.same(error.status, 404)
    test.notOk(outEntry)
    test.end()
  })
})

tap.test(' should not delete someone else\'s entry', function (test) {
  var options = {
    id: entries[0].id,
    user: users[1]
  }
  ops.delete(options, function (error) {
    test.same(error.status, 404)
    test.end()
  })
})

tap.test('should delete an entry', function (test) {
  var options = {
    id: entries[0].id,
    user: users[0]
  }
  ops.delete(options, test.end.bind(test))
})
