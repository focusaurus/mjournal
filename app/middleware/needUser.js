function needUser(req, res, next) {
  if (!req.user) {
    return res.status(403).send("Please sign in to access this operation");
  }
  next();
}

module.exports = needUser;
