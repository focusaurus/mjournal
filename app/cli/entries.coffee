#!/usr/bin/env coffee
#!/usr/bin/env coffee --nodejs --debug-brk=9091
cli = require "app/cli"
program = require "commander"
concat = require "concat-stream"
viewOp = require "app/operations/entries/view"
createOp = require "app/operations/entries/create"
updateOp = require "app/operations/entries/update"

##### helper functions #####
bodyOption = (stack) ->
  stack.command.option("-b, --body [body]",
    "Content for the journal entry. Pass '-' to provide on stdin")
  stack.use (next, entryId, options) ->
    next()
    # if options.body is "stdin"
    #   stream = concat (body) ->
    #     console.log "@bug stdin stream concat #{body}"
    #     options.body = body
    #     next()
    #   console.log "Type body then ctrl-d when done"
    #   process.stdin.pipe stream
    # else
    #   next()

##### view #####
viewAction = (options) ->
  viewOp options.user, (error, entries) ->
    cli.exit error if error
    for entry in entries
      console.log entry.created, entry.body, entry.id
    process.exit()

viewCommand = program.command("view")
  .description("view entries for user with specified id")
cli.signIn viewCommand, viewAction

##### create #####
createAction = (options) ->
  createOp options, (error, entry) ->
    cli.exit(error) if error
    console.log entry
    process.exit()

createCommand = program.command("create")
  .description("create a new journal entry")
cli.signIn createCommand, createAction

##### create #####
updateAction = (next, entryId, options) ->
  options.id = entryId
  updateOp options, (error) ->
    cli.exit(error) if error
    console.log "Entry updated"
    process.exit()

updateCommand = program.command("update <entryId>")
  .description("update an existing entry. Provide new entry body via stdin")
updateStack = new cli.Stack updateCommand
bodyOption updateStack
cli.signInMW updateStack
updateStack.use updateAction

program.description "operate on entry records"
program.parse process.argv
