var errors = require("httperrors");
var joi = require("joi");

var PAGE_SIZE = 50;
var PAGE_SCHEMA = joi.number().integer().min(1).default(1);

function paginated(run, next) {
  var valid = PAGE_SCHEMA.validate(run.options.page);
  var page = valid.value || 1;
  run.dbOp.limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE);
  next();
}

function requireUser(run, next) {
  if (!(run.options && run.options.user)) {
    next(new errors.Unauthorized("Please sign in"));
    return;
  }
  next();
}

function whereUser(run, next) {
  run.dbOp.where({
    userId: run.options.user.id
  });
  next();
}

exports.paginated = paginated;
exports.requireUser = requireUser;
exports.whereUser = whereUser;
