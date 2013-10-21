needUser = (req, res, next) ->
  console.log "@bug needUser running"
  if not req.user
    return res.status(403).send "Please sign in to access this operation"
  next()

module.exports = needUser
