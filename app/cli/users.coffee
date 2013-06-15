#!/usr/bin/env coffee
program = require "commander"
signUpOp = require "app/operations/users/sign-up"

signUp = (email) ->
  program.password "password for #{email}: ", (password) ->
    console.log "registering #{email}"
    signUpOp {email, password}, (error, user) ->
      return console.error(error) if error
      console.log user

program.description "operate on user records"
program.command("sign-up <email>")
  .description("register a new user account")
  .action signUp

program.parse process.argv
