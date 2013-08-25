PAGE_SIZE = 50

paginated = (next, options) ->
  page = options?.page or 1
  try
    page = parseInt page, 10
  catch
    page = 1
  if page < 1
    page = 1
  @dbOp.limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE)
  next()

requireUser = (next, options) ->
  if not options?.user
    return next {code: 401, "Please sign in"}
  next()

whereUser = (next, options) ->
  @dbOp.where {userId: options.user.id}
  next()

module.exports = {
  paginated
  requireUser
  whereUser
}
