#!/usr/bin/env coffee
#!/usr/bin/env coffee --nodejs --debug-brk=9091
cli = require "app/cli"
program = require "commander"
signUpOp = require "app/users/operations/sign-up"
promptly = require "promptly"

signUp = (email) ->
  promptly.password "password for #{email}: ", (error, password) ->
    console.log "registering #{email}"
    signUpOp {email, password}, (error, user) ->
      cli.exit error if error
      console.log user
      process.exit()

program.description "operate on user records"
program.command("sign-up <email>")
  .description("register a new user account")
  .action signUp

program.parse process.argv
