var _ = require("lodash");

function Stack() {
  this.stack = _.flatten([].slice.call(arguments));
}

/**
 * @param {Function[]...} varargs middleware to use in order.
 *   can be a single function or an arary of functions, any depth.
 *   varargs syntax supported
 */
Stack.prototype.use = function() {
  this.stack = this.stack.concat(_.flatten(arguments));
  return this;
};

Stack.prototype.run = function(options) {
  var self = this;
  var runStack = this.stack.slice();
  var runState = {options: options};
  function runClosure() {
    var mw = runStack.shift();
    if (typeof mw !== "function") {
      return;
    }
    mw.call(self, runClosure, runState);
  }
  runClosure();
  return this;
};

module.exports = Stack;
