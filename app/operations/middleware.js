var errors = require("app/errors");
var PAGE_SIZE = 50;

function paginated(next, options) {
  var page = options && parseInt(options.page, 10);
  if (isNaN(page)) {
    page = 1;
  }
  if (page < 1) {
    page = 1;
  }
  this.dbOp.limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE);
  next();
}

function requireUser(next, options) {
  if (!(options && options.user)) {
    return next(errors.Unauthorized("Please sign in"));
  }
  next();
}

function whereUser(next, options) {
  this.dbOp.where({
    userId: options.user.id
  });
  next();
}

module.exports = {
  paginated: paginated,
  requireUser: requireUser,
  whereUser: whereUser
};
