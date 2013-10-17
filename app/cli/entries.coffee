#!/usr/bin/env coffee --nodejs --debug-brk=9093
#!/usr/bin/env coffee
_ = require "lodash"
cli = require "app/cli"
concat = require "concat-stream"
createOp = require "app/operations/entries/create"
program = require "commander"
updateOp = require "app/operations/entries/update"
viewOp = require "app/operations/entries/view"

##### helper functions #####
bodyOption = (stack) ->
  stack.command.option("-b, --body [body]",
    "Content for the journal entry. Pass 'stdin' to provide on stdin")
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
viewAction = (next, options) ->
  viewOp _.pick(options, "user", "page"), (error, entries) ->
    cli.exit error if error
    for entry in entries
      console.log "id:", entry.id, entry.created, entry.body
    process.exit()
viewCommand = program.command("view")
  .description("view entries for a user")
viewStack = new cli.Stack viewCommand
cli.signInMW viewStack
cli.paginate viewStack
viewStack.use viewAction

##### create #####
createAction = (next, options) ->
  createOp _.pick(options, "user", "body"), (error, entry) ->
    cli.exit(error) if error
    console.log entry
    process.exit()

createCommand = program.command("create")
  .description("create a new journal entry")
createStack = new cli.Stack createCommand
bodyOption createStack
cli.signInMW createStack
createStack.use createAction

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
