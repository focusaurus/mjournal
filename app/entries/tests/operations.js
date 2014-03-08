var signUp = require("app/users/operations/sign-up");
var ops = require("app/entries/operations");
var expect = require("chai").expect;
var errors = require("app/errors");

describe("entries/operations/create+update", function() {
  var user = null;
  var user2 = null;
  var entry = null;
  var entry2 = null;
  before(function(done) {
    var inUser = {
      email: "test/entries/operations/create@example.com",
      password: "password"
    };
    signUp(inUser, function(error, outUser) {
      expect(error).not.to.exist;
      expect(outUser).to.have.property("id");
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
      expect(error).not.to.exist;
      expect(outUser).to.have.property("id");
      user2 = outUser;
      done();
    });
  });
  it("should create an entry", function(done) {
    var options = {
      user: user,
      body: "test body"
    };
    ops.create(options, function(error, outEntry) {
      expect(error).not.to.exist;
      expect(outEntry).to.have.property("id");
      expect(outEntry).to.have.property("created");
      expect(outEntry).to.have.property("updated");
      expect(outEntry).to.have.property("body", options.body);
      entry = outEntry;
      done();
    });
  });
  it("should create a second entry with different user", function(done) {
    var options = {
      user: user2,
      body: "test body2"
    };
    ops.create(options, function(error, outEntry) {
      expect(error).not.to.exist;
      expect(outEntry).to.have.property("id");
      expect(outEntry).to.have.property("created");
      expect(outEntry).to.have.property("updated");
      expect(outEntry).to.have.property("body", options.body);
      entry2 = outEntry;
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
      expect(error).not.to.exist;
      expect(outEntry).to.have.property("body", options.body);
      expect(outEntry).to.have.property("updated");
      expect(outEntry).to.have.property("created");
      expect(oldUpdated).not.to.eql(outEntry.updated);
      done();
    });
  });
  it("should view the newly created entry", function(done) {
    ops.view({
      user: user
    }, function(error, entries) {
      expect(error).not.to.exist;
      expect(entries).to.have.length.above(0);
      done();
    });
  });
  it("should find the entry with text search", function(done) {
    ops.view({
      user: user,
      textSearch: "body"
    }, function(error, entries) {
      expect(error).not.to.exist;
      expect(entries).to.have.length.above(0);
      done();
    });
  });
  it("should not find the entry with non-matching text search", function(done) {
    ops.view({
      user: user,
      textSearch: "notpresent"
    }, function(error, entries) {
      expect(error).not.to.exist;
      expect(entries).to.be.instanceof(Array);
      expect(entries).to.be.empty;
      done();
    });
  });
  it("should not update someone else's entry", function(done) {
    var options = {
      id: entry.id,
      user: user2,
      body: "test body 3 hax0rz"
    };
    var oldUpdated = entry.updated;
    ops.update(options, function(error, outEntry) {
      expect(error).to.exist;
      expect(error).to.have.property("code", 404);
      expect(outEntry).not.to.exist;
      done();
    });
  });});
