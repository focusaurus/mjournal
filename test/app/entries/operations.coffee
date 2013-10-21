signUp = require "app/users/operations/sign-up"
ops = require "app/entries/operations"
assert = require("chai").assert

describe "entries/operations/create+update", ->
  user = null
  entry = null

  before (done) ->
    inUser =
      email: "test/entries/operations/create@example.com"
      password: "password"
    signUp inUser, (error, outUser) ->
      assert.isNull error, error
      assert.property outUser, "id"
      user = outUser
      done()

  it "should create an entry", (done) ->
    options = {user, body: "test body"}
    ops.create options, (error, outEntry) ->
      assert.isNull error, error
      assert.property outEntry, "id"
      assert.property outEntry, "created"
      assert.property outEntry, "updated"
      assert.propertyVal outEntry, "body", options.body
      entry = outEntry
      done()

  #These tests depend on data created above, which is a bit dirty
  #but I can live with it
  it "should update an entry", (done) ->
    options = {id: entry.id, user, body: "test body 2"}
    oldUpdated = entry.updated
    ops.update options, (error, outEntry) ->
      assert.isNull error, error
      assert.propertyVal outEntry, "body", options.body
      assert.property outEntry, "updated"
      assert.property outEntry, "created"
      assert.notEqual oldUpdated, outEntry.updated
      done()

  it "should view the newly created entry", (done) ->
    ops.view {user}, (error, entries) ->
      assert.isNull error, error
      assert.isArray entries
      assert.ok (entries.length > 0)
      done()
