var util = require("util");
//code data obtained from
//https://en.wikipedia.org/wiki/List_of_HTTP_status_codes

function messageToName(message) {
  return message.replace(/[-' ]/g, "");
}
require("./codes").forEach(function (struct) {
  var code = struct[0];
  var message = struct[1];
  exports[messageToName(message)] = makeError(message, code);
});

function makeError(message, code) {
  function constructor(message, code) {
    if (!(this instanceof constructor)) {
      return new constructor(message, code);
    }
    this.code = code || this.code;
    this.message = message || this.message;
    Error.call(this, message);
  }
  util.inherits(constructor, Error);
  constructor.name = messageToName(message);
  constructor.prototype.message = message;
  constructor.prototype.code = code;
  return constructor;
}

//A handful of convenient aliases
exports.ClientError = exports.PreconditionFailed;
exports.ServerError = exports.InternalServerError;
