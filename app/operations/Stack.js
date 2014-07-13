function Stack() {
  this.stack = [];
}

Stack.prototype.use = function(mw) {
  this.stack.push(mw);
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
