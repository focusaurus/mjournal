var _ = require("lodash");
function Stack() {
  this.stack = _.flatten([].slice.call(arguments));
}

//@param *varargs* middleware to use in order.
//  can be a single function or an array of functions, any depth
Stack.prototype.use = function() {
  this.stack = this.stack.concat(_.flatten(arguments));
  return this;
};

Stack.prototype.run = function() {
  var self = this;
  var runState;
  function runClosure() {
    var mw = runState.stack.shift();
    if (!mw) {
      return;
    }
    mw.apply(self, runState.mwArgs);
  }
  runState = {
    mwArgs: [runClosure].concat([].slice.call(arguments)),
    stack: this.stack.slice()
  };
  runClosure();
  return this;
};

module.exports = Stack;
