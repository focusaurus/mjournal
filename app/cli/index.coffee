_  = require "lodash"
signInOp = require "app/operations/users/sign-in"
promptly = require "promptly"

class Stack
  constructor: (@command) ->
    @stack = []
    @first = true
    @command.action @action
  use: (mw) =>
    @stack.push mw
    return @
  action: =>
    mw = @stack.shift()
    if not mw
      return
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
  command.option("-u, --user <email>")
  command.action ->
    realArguments = arguments
    options = _.last arguments
    email = options.user || process.env.MJ_USER
    if email
      promptly.password "password for #{email}: ", (error, password) ->
        signInOp {email, password}, (error, user) ->
          exit error if error
          options.user = user
          realAction.apply this, realArguments
    else
      exit {code: 403, message: "Please specify a user with --user <email>"}

signInMW = (stack) ->
  stack.command.option("-u, --user <email>")
  stack.use (next) ->
    options = _.last arguments
    email = options.user || process.env.MJ_USER
    if email
      promptly.password "password for #{email}: ", (error, password) ->
        signInOp {email, password}, (error, user) ->
          exit error if error
          options.user = user
          next()
    else
      exit {code: 403, message: "Please specify a user with --user <email>"}

paginate = (stack) ->
  stack.command.option("-p, --page <page>")

module.exports = {
  exit
  paginate
  signIn
  signInMW
  Stack
}
