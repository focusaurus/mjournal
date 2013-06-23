#!/usr/bin/env coffee
#!/usr/bin/env coffee --nodejs --debug-brk=9091
cli = require "app/cli"
program = require "commander"
viewEntriesOp = require "app/operations/entries/view-entries"
createEntryOp = require "app/operations/entries/create"

viewEntries = (id) ->
  viewEntriesOp {id}, (error, entries) ->
    cli.exit error if error
    for entry in entries
      console.log entry.created, entry.body
    process.exit()

createEntry = (id, options) ->
  options =
    user:
      id: id
    body: options.body
  createEntryOp options, (error, entry) ->
    cli.exit(error) if error
    console.log entry
    process.exit()

program.description "operate on entry records"
program.command("view <userId>")
  .description("view entries for user with specified id")
  .action viewEntries

program.command("create <userId>")
  .option("-b, --body <body>", "Content for the journal entry")
  .description("create a new journal entry")
  .action createEntry
program.parse process.argv
