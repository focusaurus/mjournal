var util = require("util");
//code data obtained from
//https://en.wikipedia.org/wiki/List_of_HTTP_status_codes

function messageToName(message) {
  return message.replace(/[-' ]/g, "");
}

function makeError(message, code) {
  function Constructor(message, code) {
    if (!(this instanceof Constructor)) {
      return new Constructor(message, code);
    }
    this.code = code || this.code;
    this.message = message || this.message;
    Error.call(this, message);
  }
  util.inherits(Constructor, Error);
  Constructor.name = messageToName(message);
  Constructor.prototype.message = message;
  Constructor.prototype.code = code;
  return Constructor;
}

require("./codes").forEach(function (struct) {
  var code = struct[0];
  var message = struct[1];
  exports[messageToName(message)] = makeError(message, code);
});

//A handful of convenient aliases
exports.ClientError = exports.PreconditionFailed;
exports.ServerError = exports.InternalServerError;
