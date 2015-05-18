var joi = require("joi");

var PORT = joi.number().integer().min(1024).max(65535).required();
var DB_SCHEMA = joi.alternatives.try(joi.object().keys({
  host: joi.string().required(),
  port: PORT,
  user: joi.string().required(),
  password: joi.string(),
  database: joi.string().required()
}), joi.string());
var SESSION_SCHEMA = joi.object().keys({
  secret: joi.string().required(),
  httpOnly: joi.boolean()
});
var CONFIG_SCHEMA = joi.object().keys({
  hostname: joi.string().required(),
  nodeVersion: joi.string().required(),
  appVersion: joi.string().required(),
  db: DB_SCHEMA,
  postgres: DB_SCHEMA,
  logStream: joi.alternatives().try(joi.object(), joi.string()).required(),
  port: PORT,
  session: SESSION_SCHEMA,
  browserifyDebug: joi.boolean()
});

function validateConfig(config) {
  return joi.validate(config, CONFIG_SCHEMA, {allowUnknown: true});
}

module.exports = validateConfig;
