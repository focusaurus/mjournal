'use strict'

const errors = require('httperrors')
const joi = require('joi')

const PAGE_SIZE = 50
const PAGE_SCHEMA = joi.number().integer().min(1).default(1)

function paginated (run, next) {
  const valid = PAGE_SCHEMA.validate(run.options.page)
  const page = valid.value || 1
  run.dbOp.limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE)
  next()
}

function requireUser (run, next) {
  if (!(run.options && run.options.user)) {
    next(new errors.Unauthorized('Please sign in'))
    return
  }
  next()
}

function whereUser (run, next) {
  run.dbOp.where({
    userId: run.options.user.id
  })
  next()
}

exports.paginated = paginated
exports.requireUser = requireUser
exports.whereUser = whereUser
