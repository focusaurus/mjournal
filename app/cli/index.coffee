exit = (error) ->
  if error
    message = error.message or error.name
    if error.code?
      message = "#{message} (#{error.code})"
      code = error.code / 10
    console.error message
    process.exit code
  process.exit()

module.exports = {
  exit
}
