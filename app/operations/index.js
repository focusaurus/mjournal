function Stack() {
  this.run = this.run.bind(this);
  this.use = this.use.bind(this);
  this.stack = [];
  this.first = true;
}

Stack.prototype.use = function(mw) {
  this.stack.push(mw);
  return this;
};

Stack.prototype.run = function() {
  var mw = this.stack.shift();
  if (!mw) {
    return;
  }
  if (this.first) {
    this.first = false;
    this.mwArgs = [this.run];
    var args = [].slice.apply(arguments, [0]);
    this.mwArgs.push.apply(this.mwArgs, args);
  }
  mw.apply(this, this.mwArgs);
  return this;
};

module.exports = {
  Stack: Stack
};
