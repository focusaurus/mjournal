#!/usr/bin/env node
/* eslint no-process-exit:0 */
var _ = require("lodash");
var cli = require("app/cli");
var readline = require("readline");
var entryOps = require("app/entries/operations");
var program = require("commander");

function bodyOption(stack) {
  stack.command.option(
    "-b, --body <body>",
    "Content for the journal entry. Pass 'stdin' to provide on stdin"
  );
  return stack.use(function(next, options) {
    var input, lines;
    if (options.body === "stdin") {
      input = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      lines = [];
      input.on("line", function(line) {
        return lines.push(line);
      });
      input.on("close", function() {
        options.body = lines.join("\n");
        return next();
      });
      return console.log("Type body then ctrl-d when done");
    } else {
      return next();
    }
  });
}

function tagsOption(stack) {
  return stack.command.option(
    "-t, --tags <tags>", "Tags for the entry. Space-delimited words.");
}

function viewAction(next, options) {
  options.textSearch = options.search;
  var opOptions = _.pick(options, "user", "page", "textSearch");
  entryOps.view(opOptions, function(error, entries) {
    if (error) {
      cli.exit(error);
    }
    entries.forEach(function (entry) {
      console.log(
        "----- ID: " +
        entry.id +
        " Created: " +
        entry.created +
        " -----\ntags: " +
        (entry.tags || "") +
        "\n\n" +
        entry.body
      );
    });
    process.exit();
  });
}

var viewCommand = program.command("view")
  .description("view entries for a user");
viewCommand.option(
  "-s, --search <query>",
  "search for entries mentioning or tagged with a keyword"
);
var viewStack = new cli.Stack(viewCommand);
cli.signInMW(viewStack);
cli.paginate(viewStack);
viewStack.use(viewAction);

function createAction(next, options) {
  var opOptions = _.pick(options, "user", "body", "tags");
  entryOps.create(opOptions, function(error, entry) {
    if (error) {
      cli.exit(error);
    }
    console.log(entry);
    process.exit();
  });
}
var createCommand = program.command("create")
  .description("create a new journal entry");
var createStack = new cli.Stack(createCommand);
cli.signInMW(createStack);
bodyOption(createStack);
tagsOption(createStack);
createStack.use(createAction);

function updateAction(next, commandOptions) {
  var options = _.pick(commandOptions, "user", "body", "tags");
  options.id = commandOptions.entryId;
  entryOps.update(options, function(error) {
    if (error) {
      cli.exit(error);
    }
    console.log("Entry updated");
    process.exit();
  });
}

var updateCommand = program.command("update")
  .option("-i,--entryId <entryId>")
  .description("update an existing entry. Provide new entry body via stdin");
var updateStack = new cli.Stack(updateCommand);
cli.signInMW(updateStack);
bodyOption(updateStack);
tagsOption(updateStack);
updateStack.use(updateAction);
program.description("operate on entry records");

if (require.main === module) {
  program.parse(process.argv);
}

module.exports = {
  updateAction: updateAction
};
