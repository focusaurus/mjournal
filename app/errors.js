var util = require("util");

function makeError(name, message, code) {
  function constructor(message, code) {
    if (!(this instanceof constructor)) {
      return new constructor(message, code);
    }
    this.code = code || this.code;
    this.message = message || this.message;
    Error.call(this, message);
  }
  util.inherits(constructor, Error);
  constructor.name = name;
  constructor.prototype.message = message;
  constructor.prototype.code = code;
  return constructor;
}

module.exports = {
  ServerError: makeError("ServerError", "internal server error", 503),
  ClientError: makeError("ClientError", "precondition failed", 412),
  Conflict: makeError("Conflict", "conflict", 409)
}
