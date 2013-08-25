class Stack
  constructor: () ->
    @stack = []
    @first = true
  use: (mw) =>
    @stack.push mw
    return @
  run: =>
    mw = @stack.shift()
    if not mw
      return
    if @first
      @first = false
      @mwArgs = [@run]
      args = [].slice.apply arguments, [0]
      @mwArgs.push.apply @mwArgs, args
    #middlware functions get the stack as `this`,
    #`next` as the first positional argument
    #and then whatever other arguments were initially passed
    mw.apply @, @mwArgs
    return @

module.exports = {
  Stack
}
