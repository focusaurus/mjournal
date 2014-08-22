var _ = require("lodash");
var signInOp = require("app/users/operations/sign-in");
var promptly = require("promptly");

function Stack(command) {
  this.command = command;
  this.action = this.action.bind(this);
  this.use = this.use.bind(this);
  this.stack = [];
  this.first = true;
  this.command.action(this.action);
}

Stack.prototype.use = function(mw) {
  this.stack.push(mw);
  return this;
};

Stack.prototype.action = function() {
  var args, mw;
  mw = this.stack.shift();
  if (!mw) {
    return this;
  }
  if (this.first) {
    this.first = false;
    this.mwArgs = [this.action];
    args = [].slice.apply(arguments, [0]);
    this.mwArgs.push.apply(this.mwArgs, args);
  }
  mw.apply(this.command, this.mwArgs);
  return this;
};

/*eslint no-process-exit:0*/
function exit(error) {
  var code, message;
  if (error) {
    message = error.message || error.name;
    if (error.code !== null) {
      message = "" + message + " (" + error.code + ")";
      code = error.code / 10;
    }
    console.error(message);
    process.exit(code);
  }
  return process.exit();
}

function signInMW(stack) {
  stack.command.option("-u, --user <email>");
  stack.use(function(callback) {
    var options = _.last(arguments);
    var signInOptions = {
      email: options.user || process.env.MJ_USER,
      password: options.password || process.env.MJ_PASSWORD
    };
    if (!signInOptions.email) {
      exit({
        code: 403,
        message: "Please specify a user with --user <email>"
      });
      return;
    }
    function getUser() {
      signInOp(signInOptions, function(error, user) {
        if (error) {
          exit(error);
        }
        options.user = user;
        callback();
      });
    }
    if (signInOptions.password) {
      getUser();
      return;
    }
    promptly.password(
      "password for " + signInOptions.email + ": ", function(error, password) {
        if (error) {
          callback(error);
          return;
        }
        signInOptions.password = password;
        getUser();
      });
  });
}

function paginate(stack) {
  stack.command.option("-p, --page <page>");
}

module.exports = {
  exit: exit,
  paginate: paginate,
  signInMW: signInMW,
  Stack: Stack
};
