var expect = require("expectacle");
var errors = require("app/errors");

describe("errors.ClientError", function () {
  it("should be callable as a constructor with new", function() {
    var error = new errors.ClientError();
    expect(error).toBeAnInstanceOf(Error);
    expect(error).toBeAnInstanceOf(errors.ClientError);
  });
  it("should be callable as a function without new", function() {
    var error = new errors.ClientError();
    expect(error).toBeAnInstanceOf(Error);
    expect(error).toBeAnInstanceOf(errors.ClientError);
  });
  it("should be have default code and message", function() {
    var error = new errors.ClientError();
    expect(error).toHaveProperty("code");
    expect(error.code).toBe(412);
    expect(error).toHaveProperty("message");
    expect(error.message).toBe("Precondition Failed");
  });
  it("should be allow specifying a particular message", function() {
    var error = new errors.ClientError("foo");
    expect(error).toHaveProperty("message");
    expect(error.message).toBe("foo");
  });
  it("should be allow specifying a particular code", function() {
    var error = new errors.ClientError("foo", 442);
    expect(error).toHaveProperty("code");
    expect(error.code).toBe(442);
  });
});

describe("errors.Conflict", function () {
  it("should be callable as a constructor with new", function() {
    var error = new errors.Conflict();
    expect(error).toBeAnInstanceOf(Error);
    expect(error).toBeAnInstanceOf(errors.Conflict);
  });
  it("should be callable as a function without new", function() {
    var error = new errors.Conflict();
    expect(error).toBeAnInstanceOf(Error);
    expect(error).toBeAnInstanceOf(errors.Conflict);
  });
  it("should be have default code and message", function() {
    var error = new errors.Conflict();
    expect(error).toHaveProperty("code");
    expect(error.code).toBe(409);
    expect(error).toHaveProperty("message");
    expect(error.message).toBe("Conflict");
  });
  it("should be allow specifying a particular message", function() {
    var error = new errors.Conflict("foo");
    expect(error).toHaveProperty("message");
    expect(error.message).toBe("foo");
  });
  it("should be allow specifying a particular code", function() {
    var error = new errors.Conflict("foo", 442);
    expect(error).toHaveProperty("code");
    expect(error.code).toBe(442);
  });
});

describe("errors.InternalServerError", function () {
  it("should be callable as a constructor with new", function() {
    var error = new errors.InternalServerError();
    expect(error).toBeAnInstanceOf(Error);
    expect(error).toBeAnInstanceOf(errors.InternalServerError);
  });
  it("should be callable as a function without new", function() {
    var error = new errors.InternalServerError();
    expect(error).toBeAnInstanceOf(Error);
    expect(error).toBeAnInstanceOf(errors.InternalServerError);
  });
  it("should be have default code and message", function() {
    var error = new errors.InternalServerError();
    expect(error).toHaveProperty("code");
    expect(error.code).toBe(500);
    expect(error).toHaveProperty("message");
    expect(error.message).toBe("Internal Server Error");
  });
  it("should be allow specifying a particular message", function() {
    var error = new errors.InternalServerError("foo");
    expect(error).toHaveProperty("message");
    expect(error.message).toBe("foo");
  });
  it("should be allow specifying a particular code", function() {
    var error = new errors.InternalServerError("foo", 442);
    expect(error).toHaveProperty("code");
    expect(error.code).toBe(442);
  });
});

describe("errors module", function () {
  it("should have expected constructors and handle", function() {
    ["Unauthorized", "Imateapot", "RequestURITooLong", "PreconditionFailed"].forEach(function (constructor) {
      expect(errors).toHaveMember(constructor);
      expect(errors[constructor]).toBeFunction("function");
    });
  });
});
