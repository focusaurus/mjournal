var signInOp = require('./users/operations/sign-in')
var promptly = require('promptly')
var ware = require('ware')

function exit (error) {
  var code, message
  if (error) {
    message = error.message || error.name
    if (error.status !== null) {
      message = '' + message + ' (' + error.status + ')'
      code = error.status / 10
    }
    console.error(message)
    process.exit(code)
  }
  process.exit()
}

function exitIfError (error) {
  if (error) {
    exit(error)
  }
}

function signInMW (stack) {
  stack.command.option('-u, --user <email>')
  stack.use(function signInInner (options, next) {
    var signInOptions = {
      email: options.user || process.env.MJ_USER,
      password: options.password || process.env.MJ_PASSWORD
    }
    if (!signInOptions.email) {
      exit({
        code: 403,
        message: 'Please specify a user with --user <email>'
      })
    }
    function getUser () {
      signInOp(signInOptions, function (error, user) {
        exitIfError(error)
        options.user = user
        next()
      })
    }
    if (signInOptions.password) {
      getUser()
      return
    }
    promptly.password(
      'password for ' + signInOptions.email + ': ', function (error, password) {
        if (error) {
          next(error)
          return
        }
        signInOptions.password = password
        getUser()
      })
  })
  return stack
}

function paginate (stack) {
  stack.command.option('-p, --page <page>')
  return stack
}

function command (program, name, description) {
  var stack = ware()
  stack.command = program
    .command(name)
    .description(description)
    .action(stack.run.bind(stack))
  return stack
}

module.exports = {
  command: command,
  exit: exit,
  exitIfError: exitIfError,
  paginate: paginate,
  signInMW: signInMW
}
