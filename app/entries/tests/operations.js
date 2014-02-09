var signUp = require("app/users/operations/sign-up");
var ops = require("app/entries/operations");
var assert = require("chai").assert;

describe("entries/operations/create+update", function() {
  var user = null;
  var entry = null;
  before(function(done) {
    var inUser = {
      email: "test/entries/operations/create@example.com",
      password: "password"
    };
    signUp(inUser, function(error, outUser) {
      assert.isNull(error, error);
      assert.property(outUser, "id");
      user = outUser;
      done();
    });
  });
  it("should create an entry", function(done) {
    var options = {
      user: user,
      body: "test body"
    };
    ops.create(options, function(error, outEntry) {
      assert.isNull(error, error);
      assert.property(outEntry, "id");
      assert.property(outEntry, "created");
      assert.property(outEntry, "updated");
      assert.propertyVal(outEntry, "body", options.body);
      entry = outEntry;
      done();
    });
  });
  it("should update an entry", function(done) {
    var options = {
      id: entry.id,
      user: user,
      body: "test body 2"
    };
    var oldUpdated = entry.updated;
    ops.update(options, function(error, outEntry) {
      assert.isNull(error, error);
      assert.propertyVal(outEntry, "body", options.body);
      assert.property(outEntry, "updated");
      assert.property(outEntry, "created");
      assert.notEqual(oldUpdated, outEntry.updated);
      done();
    });
  });
  it("should view the newly created entry", function(done) {
    ops.view({
      user: user
    }, function(error, entries) {
      assert.isNull(error, error);
      assert.isArray(entries);
      assert.ok(entries.length > 0);
      done();
    });
  });
});
