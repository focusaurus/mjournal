_  = require "lodash"
signInOp = require "app/operations/users/sign-in"

exit = (error) ->
  if error
    message = error.message or error.name
    if error.code?
      message = "#{message} (#{error.code})"
      code = error.code / 10
    console.error message
    process.exit code
  process.exit()

signIn = (command, realAction) ->
  command.option("-u,--user <email>")
  command.action ->
    realArguments = arguments
    options = _.last arguments
    if options.user
      command.password "password: ", (password) ->
        signInOp {email: options.user, password}, (error, user) ->
          exit error if error
          options.user = user
          realAction.apply this, realArguments
    else
      exit {code: 403, message: "Please specify a user with --user <email>"}

module.exports = {
  exit
  signIn
}
