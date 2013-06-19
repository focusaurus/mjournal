#!/usr/bin/env coffee
#!/usr/bin/env coffee --nodejs --debug-brk=9091
cli = require "app/cli"
program = require "commander"
signUpOp = require "app/operations/users/sign-up"

signUp = (email) ->
  program.password "password for #{email}: ", (password) ->
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
