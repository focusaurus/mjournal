#!/usr/bin/env coffee
#!/usr/bin/env coffee --nodejs --debug-brk=9091
cli = require "app/cli"
program = require "commander"
concat = require "concat-stream"
viewOp = require "app/operations/entries/view"
createOp = require "app/operations/entries/create"
updateOp = require "app/operations/entries/update"

##### helper functions #####
bodyOption = (command, stack) ->
  command.option("-b, --body [body]",
    "Content for the journal entry. Pass '-' to provide on stdin")
  stack.use (next, entryId, options) ->
    console.log "@bug bodyOption middleware running", this, entryId
    next()
    #if options.body is "-"
    #  stream = concat (body) ->
    #else
    #  realAction.apply this, arguments

class Stack
  constructor: (@command) ->
    console.log "@bug Stack constructor"
    @stack = []
    @first = true
    @command.action @action
  use: (mw) =>
    console.log "@bug stack.use", mw, @stack.length
    @stack.push mw
    return @
  action: =>
    mw = @stack.shift()
    if not mw
      return console.log "@bug commandware stack empty"
    console.log "@bug commandware action called #{this.stack.length}"
    if @first
      @first = false
      @mwArgs = [@action]
      args = [].slice.apply arguments, [0]
      @mwArgs.push.apply @mwArgs, args
    #middlware functions get the command as `this`
    #`next` as the first positional argument
    #and then whatever other arguments were initially passed
    mw.apply @command, @mwArgs
    return @

middleware = (command) ->
  commandware =
    stack: []
    first: true
    use: (fn) =>
      this.stack.push fn
      return this
    action: =>
      fn = this.stack.shift()
      if not fn
        return console.log "@bug commandware stack empty"
      console.log "@bug commandware action called #{this.stack.length}"
      if this.first
        this.first = false
        this.mwArgs = [this.action]
        args = [].slice.apply arguments, [0]
        this.mwArgs.push.apply this.mwArgs, args
      #middlware functions get the command as `this`
      #`next` as the first positional argument
      #and then whatever other arguments were initially passed
      fn.apply command, this.mwArgs
      return this
  command.action commandware.action.bind(commandware)
  return commandware

##### view #####
viewAction = (options) ->
  viewOp options.user, (error, entries) ->
    cli.exit error if error
    for entry in entries
      console.log entry.created, entry.body
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
updateAction = (options) ->
  stream = concat (body) ->
    console.log('@bug stdin is', body);
  process.stdin.pipe stream
  # updateOp options, (error, entry) ->
  #   cli.exit(error) if error
  #   console.log entry
  #   process.exit()

updateCommand = program.command("update <entryId>")
  .description("update an existing entry. Provide new entry body via stdin")
updateStack = new Stack updateCommand
updateStack.use (next, entryId, options) ->
  console.log "@bug update MW 1 running", entryId
  next()
updateStack.use (next, entryId, options) ->
  console.log "@bug update MW 2 running", entryId
  next()
bodyOption updateCommand, updateStack
#cli.signIn updateCommand, createAction

program.description "operate on entry records"
program.parse process.argv
