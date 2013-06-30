signUp = require "app/operations/users/sign-up"
create = require "app/operations/entries/create"
view = require "app/operations/entries/view"
assert = require("chai").assert

describe "operations/entries/create", ->
  user = null
  entry = null

  before (done) ->
    inUser =
      email: "test/operations/entries/create@example.com"
      password: "password"
    signUp inUser, (error, outUser) ->
      assert.isNull error, error
      assert.property outUser, "id"
      user = outUser
      done()

  it "should create an entry", (done) ->
    options = {user, body: "test body"}
    create options, (error, outEntry) ->
      assert.isNull error, error
      assert.property outEntry, "id"
      assert.propertyVal outEntry, "body", options.body
      entry = outEntry
      done()

  #This test depends on data created above, which is a bit dirty
  #but I can live with it
  it "should view the newly created entry", (done) ->
    view user, (error, entries) ->
      assert.isNull error, error
      assert.isArray entries
      assert.ok (entries.length > 0)
      done()
