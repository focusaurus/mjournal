'use strict'

var joi = require('joi')

var userSchema = joi.object().strict(false).keys({
  id: joi.number().integer().min(1),
  email: joi.string().optional(),
  theme: joi.string().optional()
})

module.exports = userSchema
