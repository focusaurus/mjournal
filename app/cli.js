var _ = require("lodash");
var signInOp = require("app/users/operations/signIn");
var promptly = require("promptly");
var ware = require("ware");

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
    if (error.status !== null) {
      message = "" + message + " (" + error.status + ")";
      code = error.status / 10;
    }
    console.error(message);
    process.exit(code);
  }
  process.exit();
}

function exitIfError(error) {
  if (error) {
    exit(error);
  }
}

function signInMW(stack) {
  stack.command.option("-u, --user <email>");
  stack.use(function signInInner(options, next) {
    var signInOptions = {
      email: options.user || process.env.MJ_USER,
      password: options.password || process.env.MJ_PASSWORD
    };
    if (!signInOptions.email) {
      exit({
        code: 403,
        message: "Please specify a user with --user <email>"
      });
    }
    function getUser() {
      signInOp(signInOptions, function(error, user) {
        exitIfError(error);
        options.user = user;
        next();
      });
    }
    if (signInOptions.password) {
      getUser();
      return;
    }
    promptly.password(
      "password for " + signInOptions.email + ": ", function(error, password) {
        if (error) {
          next(error);
          return;
        }
        signInOptions.password = password;
        getUser();
      });
  });
  return stack;
}

function paginate(stack) {
  stack.command.option("-p, --page <page>");
}

function command(program, name, description) {
  var stack = ware();
  stack.command = program
    .command(name)
    .description(description)
    .action(stack.run.bind(stack));
  return stack;
}

module.exports = {
  command: command,
  exit: exit,
  exitIfError: exitIfError,
  paginate: paginate,
  signInMW: signInMW,
  Stack: Stack
};
