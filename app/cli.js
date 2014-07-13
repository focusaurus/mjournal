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
  return stack.use(function(next) {
    var email, options;
    options = _.last(arguments);
    email = options.user || process.env.MJ_USER;
    if (email) {
      return promptly.password("password for " + email + ": ", function(error, password) {
        return signInOp({
          email: email,
          password: password
        }, function(error, user) {
          if (error) {
            exit(error);
          }
          options.user = user;
          return next();
        });
      });
    } else {
      return exit({
        code: 403,
        message: "Please specify a user with --user <email>"
      });
    }
  });
}

function paginate(stack) {
  return stack.command.option("-p, --page <page>");
}

module.exports = {
  exit: exit,
  paginate: paginate,
  signInMW: signInMW,
  Stack: Stack
};
