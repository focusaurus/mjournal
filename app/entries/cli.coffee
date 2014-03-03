#!/usr/bin/env coffee
#!/usr/bin/env coffee --nodejs --debug-brk=9093
_ = require "lodash"
cli = require "app/cli"
readline = require "readline"
entryOps = require "app/entries/operations"
program = require "commander"

##### helper functions #####
bodyOption = (stack) ->
  stack.command.option("-b, --body <body>",
    "Content for the journal entry. Pass 'stdin' to provide on stdin")
  stack.use (next, options) ->
    if options.body is "stdin"
      input = readline.createInterface
        input: process.stdin
        output: process.stdout
      lines = []
      input.on "line", (line) -> lines.push line
      input.on "close", ->
        options.body = lines.join("\n")
        next()
      console.log "Type body then ctrl-d when done"
    else
      next()

tagsOption = (stack) ->
  stack.command.option("-t, --tags <tags>",
    "Tags for the entry. Space-delimited words.")

##### view #####
viewAction = (next, options) ->
  options.textSearch = options.search
  entryOps.view _.pick(options, "user", "page", "textSearch"), (error, entries) ->
    cli.exit error if error
    for entry in entries
      console.log "id:", entry.id, entry.created, entry.body
    process.exit()
viewCommand = program.command("view")
  .description("view entries for a user")
viewCommand.option("-s, --search <query>",
  "search for entries mentioning or tagged with a keyword")
viewStack = new cli.Stack viewCommand
cli.signInMW viewStack
cli.paginate viewStack
viewStack.use viewAction

##### create #####
createAction = (next, options) ->
  entryOps.create _.pick(options, "user", "body", "tags"), (error, entry) ->
    cli.exit(error) if error
    console.log entry
    process.exit()

createCommand = program.command("create")
  .description("create a new journal entry")
createStack = new cli.Stack createCommand
cli.signInMW createStack
bodyOption createStack
tagsOption createStack
createStack.use createAction

##### update #####
updateAction = (next, options) ->
  options.id = options.entryId
  entryOps.update options, (error) ->
    cli.exit(error) if error
    console.log "Entry updated"
    process.exit()

updateCommand = program.command("update")
  .option("-i,--entryId <entryId>")
  .description("update an existing entry. Provide new entry body via stdin")
updateStack = new cli.Stack updateCommand
cli.signInMW updateStack
bodyOption updateStack
updateStack.use updateAction

program.description "operate on entry records"
program.parse process.argv
