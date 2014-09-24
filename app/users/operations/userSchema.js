var joi = require("joi");

var USER_SCHEMA = joi.object().keys({
  email: joi.string().regex(/.@./).required(),
  password: joi.string().required()
});

module.exports = USER_SCHEMA;
