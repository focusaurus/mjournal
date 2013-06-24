#!/usr/bin/env coffee
#!/usr/bin/env coffee --nodejs --debug-brk=9091
cli = require "app/cli"
program = require "commander"
viewEntriesOp = require "app/operations/entries/view-entries"
createEntryOp = require "app/operations/entries/create"

viewEntries = (options) ->
  viewEntriesOp options.user, (error, entries) ->
    cli.exit error if error
    for entry in entries
      console.log entry.created, entry.body
    process.exit()

createEntry = (options) ->
  createEntryOp options, (error, entry) ->
    cli.exit(error) if error
    console.log entry
    process.exit()

program.description "operate on entry records"
viewCommand = program.command("view")
  .description("view entries for user with specified id")
cli.signIn viewCommand, viewEntries

create = program.command("create")
  .option("-b, --body <body>", "Content for the journal entry")
  .description("create a new journal entry")
cli.signIn create, createEntry

program.parse process.argv
