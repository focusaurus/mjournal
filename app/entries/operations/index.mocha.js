var _ = require("lodash");
var signUp = require("app/users/operations/sign-up");
var ops = require("app/entries/operations");
var expect = require("expectacle");

describe("entries/operations/create+update+view+viewTags", function() {
  var user = null;
  var user2 = null;
  var entry = null;
  before(function(done) {
    var inUser = {
      email: "test/entries/operations/create@example.com",
      password: "password"
    };
    signUp(inUser, function(error, outUser) {
      expect(error).toBeNull();
      expect(outUser).toHaveProperty("id");
      user = outUser;
      done();
    });
  });
  before(function(done) {
    var inUser = {
      email: "test/entries/operations/create2@example.com",
      password: "password"
    };
    signUp(inUser, function(error, outUser) {
      expect(error).toBeNull();
      expect(outUser).toHaveProperty("id");
      user2 = outUser;
      done();
    });
  });
  it("should create an entry", function(done) {
    var options = {
      user: user,
      body: "test body",
      tags: "e1t1 e1t2"
    };
    ops.create(options, function(error, outEntry) {
      expect(error).toBeNull();
      expect(outEntry).toHaveProperty("id");
      expect(outEntry).toHaveProperty("created");
      expect(outEntry).toHaveProperty("updated");
      expect(outEntry).toHaveProperty("body");
      expect(outEntry.body).toBe(options.body);
      entry = outEntry;
      done();
    });
  });
  it("should create a second entry with different user", function(done) {
    var options = {
      user: user2,
      body: "test body2",
      tags: "e2t1 e2t2"
    };
    ops.create(options, function(error, outEntry) {
      expect(error).toBeNull();
      expect(outEntry).toHaveProperty("id");
      expect(outEntry).toHaveProperty("created");
      expect(outEntry).toHaveProperty("updated");
      expect(outEntry).toHaveProperty("body");
      expect(outEntry.body).toBe(options.body);
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
      expect(error).toBeNull();
      expect(outEntry).toHaveProperty("body");
      expect(outEntry.body).toBe(options.body);
      expect(outEntry).toHaveProperty("updated");
      expect(outEntry).toHaveProperty("created");
      expect(oldUpdated).not.toEqual(outEntry.updated);
      done();
    });
  });
  it("should view the newly created entry", function(done) {
    ops.view({
      user: user
    }, function(error, entries) {
      expect(error).toBeNull();
      expect(entries).not.toBeEmpty();
      done();
    });
  });
  it("should view the user's tags", function(done) {
    ops.viewTags({
      user: user
    }, function(error, tags) {
      expect(error).toBeNull();
      tags = _.pluck(tags, "text");
      expect(tags.indexOf("e1t1") >= 0).toBeTrue(tags);
      expect(tags.indexOf("e1t2") >= 0).toBeTrue(tags);
      expect(tags.indexOf("e2t1") >= 0).toBeFalse(tags);
      expect(tags.indexOf("e2t2") >= 0).toBeFalse(tags);
      expect(tags.length).toBe(2);
      done();
    });
  });
  it("should find the entry with text search", function(done) {
    ops.view({
      user: user,
      textSearch: "body"
    }, function(error, entries) {
      expect(error).toBeNull();
      expect(entries).not.toBeEmpty(0);
      done();
    });
  });
  it("should not find the entry with non-matching text search", function(done) {
    ops.view({
      user: user,
      textSearch: "notpresent"
    }, function(error, entries) {
      expect(error).toBeNull();
      expect(entries).toBeArray();
      expect(entries).toBeEmpty();
      done();
    });
  });
  it("should not update someone else's entry", function(done) {
    var options = {
      id: entry.id,
      user: user2,
      body: "test body 3 hax0rz"
    };
    ops.update(options, function(error, outEntry) {
      expect(error).not.toBeNull();
      expect(error).toHaveProperty("code");
      expect(error.code).toBe(404);
      expect(outEntry).toBeUndefined();
      done();
    });
  });
});
