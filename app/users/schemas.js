var joi = require('joi')

var EMAIL = /.@./

var USER = joi.object().keys({
  id: joi.number().min(1).required()
}).unknown()

var SIGN_IN = joi.object().keys({
  email: joi.string().regex(EMAIL).required(),
  password: joi.string().required(),
  user: USER
})

var UPDATE = joi.object().keys({
  email: joi.string().regex(EMAIL).optional(),
  theme: joi.string().regex(/[a-z]{1,256}/).optional(),
  user: USER.required()
}).or('theme', 'email')

exports.SIGN_IN = SIGN_IN
exports.UPDATE = UPDATE
