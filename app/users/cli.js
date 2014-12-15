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
      cli.exitIfError(error);
      console.log(user);
      /* eslint no-process-exit:0 */
      process.exit();
    });
  });
}

function key(options) {
  operations.createKey(options, function(error, key) {
    cli.exitIfError(error);
    console.log(key);
    process.exit();
  });
}

program.description("operate on user records");
program.command("sign-up <email>")
  .description("register a new user account").action(signUp);

var keyStack = cli.command(
  program, "create-key", "create an authentication key for CLI/API access");
cli.signInMW(keyStack).use(key);

program.parse(process.argv);
