signUp = require "app/operations/users/sign-up"
signIn = require "app/operations/users/sign-in"
assert = require("chai").assert

describe "sign-up", ->
  it "should create a user.id and not return the password", (done) ->
    newUser =
      email: "test@example.com"
      password: "password"
    signUp newUser, (error, user) ->
      assert.isNull error, error
      assert.notProperty user, "bcryptedPassword"
      assert.property user, "id"
      assert.propertyVal user, "email", newUser.email
      done()

  it "should prevent duplicate emails", (done) ->
    newUser =
      email: "dupe@example.com"
      password: "password"
    signUp newUser, (error) ->
      assert.isNull error, error
      signUp newUser, (error, user) ->
        assert.isObject error
        assert.propertyVal error, "code", 409
        done()

describe "sign-in", ->
  newUser =
    email: "test2@example.com"
    password: "password"

  before (done) -> signUp newUser, done

  it "should return the user if password is correct", (done) ->
    signIn newUser, (error, user) ->
      assert.isNull error, error
      assert.notProperty user, "bcryptedPassword"
      assert.property user, "id"
      assert.propertyVal user, "email", newUser.email
      done()

  it "should fail with incorrect password", (done) ->
    signIn {email: newUser.email, password: "incorrect"}, (error, user) ->
      assert.isObject error
      assert.propertyVal error, "code", 403
      done()
