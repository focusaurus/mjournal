var redeemToken = require("./operations/redeemToken");

function byToken(req, res, next) {
  if (req.user) {
    next();
    return;
  }
  var auth = req.get("Authorization");
  if (!auth) {
    next();
    return;
  }
  var prefix = "token ";
  if (auth.slice(0, prefix.length) !== prefix) {
    next();
    return;
  }
  var token = auth.slice(prefix.length);
  redeemToken({value: token}, function (error, user) {
    if (error) {
      next(error);
      return;
    }
    res.locals.user = req.user = user;
    next();
  });
}

module.exports = byToken;
