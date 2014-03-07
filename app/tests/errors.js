var expect = require("chai").expect;
var errors = require("app/errors");

describe("errors.ClientError", function () {
  it("should be callable as a constructor with new", function() {
    var error = new errors.ClientError();
    expect(error).to.be.instanceof(Error);
    expect(error).to.be.instanceof(errors.ClientError);
  });
  it("should be callable as a function without new", function() {
    var error = errors.ClientError();
    expect(error).to.be.instanceof(Error);
    expect(error).to.be.instanceof(errors.ClientError);
  });
  it("should be have default code and message", function() {
    var error = errors.ClientError();
    expect(error).to.have.property("code", 412);
    expect(error).to.have.property("message", "precondition failed");
  });
  it("should be allow specifying a particular message", function() {
    var error = errors.ClientError("foo");
    expect(error).to.have.property("message", "foo");
  });
  it("should be allow specifying a particular code", function() {
    var error = errors.ClientError("foo", 442);
    expect(error).to.have.property("code", 442);
  });
});

describe("errors.Conflict", function () {
  it("should be callable as a constructor with new", function() {
    var error = new errors.Conflict();
    expect(error).to.be.instanceof(Error);
    expect(error).to.be.instanceof(errors.Conflict);
  });
  it("should be callable as a function without new", function() {
    var error = errors.Conflict();
    expect(error).to.be.instanceof(Error);
    expect(error).to.be.instanceof(errors.Conflict);
  });
  it("should be have default code and message", function() {
    var error = errors.Conflict();
    expect(error).to.have.property("code", 409);
    expect(error).to.have.property("message", "conflict");
  });
  it("should be allow specifying a particular message", function() {
    var error = errors.Conflict("foo");
    expect(error).to.have.property("message", "foo");
  });
  it("should be allow specifying a particular code", function() {
    var error = errors.Conflict("foo", 442);
    expect(error).to.have.property("code", 442);
  });
});

describe("errors.ServerError", function () {
  it("should be callable as a constructor with new", function() {
    var error = new errors.ServerError();
    expect(error).to.be.instanceof(Error);
    expect(error).to.be.instanceof(errors.ServerError);
  });
  it("should be callable as a function without new", function() {
    var error = errors.ServerError();
    expect(error).to.be.instanceof(Error);
    expect(error).to.be.instanceof(errors.ServerError);
  });
  it("should be have default code and message", function() {
    var error = errors.ServerError();
    expect(error).to.have.property("code", 503);
    expect(error).to.have.property("message", "internal server error");
  });
  it("should be allow specifying a particular message", function() {
    var error = errors.ServerError("foo");
    expect(error).to.have.property("message", "foo");
  });
  it("should be allow specifying a particular code", function() {
    var error = errors.ServerError("foo", 442);
    expect(error).to.have.property("code", 442);
  });
});
