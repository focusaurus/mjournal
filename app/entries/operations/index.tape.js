var _ = require('lodash')
var expect = require('chaimel')
var ops = require('app/entries/operations')
var signUp = require('app/users/operations/signUp')
var test = require('tape')

var group = 'app/entries/operations/index'

var users = []
var entries = []

function createUser (callback) {
  var inUser = {
    email: 'test/entries/operations/create' + (users.length + 1) + '@example.com',
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
      expect(outEntry).toHaveProperty('id')
      expect(outEntry).toHaveProperty('created')
      expect(outEntry).toHaveProperty('updated')
      expect(outEntry).toHaveProperty('body')
      expect(outEntry.body).toEqual(options.body)
      entries.push(outEntry)
      assert.end()
    })
  })
})

test(group + 'should view the newly created entry', function (assert) {
  ops.view({
    user: users[0]
  }, function (error, entries) {
    expect(error).notToExist()
    expect(entries).notToBeEmpty()
    assert.end()
  })
})

test(group + 'should find the entry with text search', function (assert) {
  ops.view({
    user: users[0],
    textSearch: 'body'
  }, function (error, entries) {
    expect(error).notToExist()
    expect(entries).notToBeEmpty()
    assert.end()
  })
})

test(group + 'should not find the entry with non-matching text search', function (assert) {
  ops.view({
    user: users[0],
    textSearch: 'notpresent'
  }, function (error, entries) {
    expect(error).notToExist()
    expect(entries).toBeAnInstanceOf(Array)
    expect(entries).toBeEmpty()
    assert.end()
  })
})

test(group + "should view the user's tags", function (assert) {
  ops.viewTags({
    user: users[0]
  }, function (error, tags) {
    expect(error).notToExist()
    tags = _.pluck(tags, 'text')
    expect(tags.indexOf('e1t1') >= 0).toBeTrue(tags)
    expect(tags.indexOf('e1t2') >= 0).toBeTrue(tags)
    expect(tags.indexOf('e2t1') >= 0).toBeFalse(tags)
    expect(tags.indexOf('e2t2') >= 0).toBeFalse(tags)
    expect(tags.length).toEqual(2)
    assert.end()
  })
})

test(group + 'should update an entry', function (assert) {
  var entry = entries[0]
  var options = {
    id: entries[0].id,
    user: users[0],
    body: 'test body 2'
  }
  var oldUpdated = entry.updated
  ops.update(options, function (error, outEntry) {
    expect(error).notToExist()
    expect(outEntry).toHaveProperty('body')
    expect(outEntry.body).toEqual(options.body)
    expect(outEntry).toHaveProperty('updated')
    expect(outEntry).toHaveProperty('created')
    expect(oldUpdated).notToEqual(outEntry.updated)
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
      expect(error).notToExist()
      expect(outEntry).toHaveProperty('id')
      expect(outEntry).toHaveProperty('created')
      expect(outEntry).toHaveProperty('updated')
      expect(outEntry).toHaveProperty('body')
      expect(outEntry.body).toEqual(options.body)
      entries.push(outEntry)
      assert.end()
    })
  })
})

test(group + "should not update someone else's entry", function (assert) {
  var options = {
    id: entries[0].id,
    user: users[1],
    body: 'test body 3 hax0rz'
  }
  ops.update(options, function (error, outEntry) {
    expect(error).notToBeNull()
    expect(error).toHaveProperty('status')
    expect(error.status).toEqual(404)
    expect(outEntry).toBeUndefined()
    assert.end()
  })
})

test(group + "should not delete someone else's entry", function (assert) {
  var options = {
    id: entries[0].id,
    user: users[1]
  }
  ops.delete(options, function (error) {
    expect(error).notToBeNull()
    expect(error).toHaveProperty('status')
    expect(error.status).toEqual(404)
    assert.end()
  })
})

test(group + 'should delete an entry', function (assert) {
  var options = {
    id: entries[0].id,
    user: users[0]
  }
  ops.delete(options, assert.end.bind(assert))
})
