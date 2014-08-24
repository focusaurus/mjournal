#!/usr/bin/env node
var cli = require("app/cli");
var program = require("commander");
var operations = require("./operations");
var promptly = require("promptly");

function signUp(email) {
  promptly.password("password for " + email + ": ", function(error, password) {
    console.log("registering " + email);
    operations.signUp({
      email: email,
      password: password
    }, function(error, user) {
      if (error) {
        cli.exit(error);
      }
      console.log(user);
      /* eslint no-process-exit:0 */
      process.exit();
    });
  });
}

function token(next, options) {
  operations.createToken(options, function(error, token) {
    if (error) {
      cli.exit(error);
    }
    console.log(token);
    process.exit();
  });
}

program.description("operate on user records");
program.command("sign-up <email>")
  .description("register a new user account").action(signUp);
var tokenCommand = program.command("create-token")
  .description("create an authentication token for CLI/API access");
var tokenStack = new cli.Stack(tokenCommand);
cli.signInMW(tokenStack);
tokenStack.use(token);

program.parse(process.argv);
