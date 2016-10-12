'use strict'

const fs = require('fs')
const joi = require('joi')
const pack = require('./package')
const url = require('url')

const appName = pack.name
const port = joi.number().integer().min(1024).max(65535)

/* eslint-disable max-len */
const schema = joi.object().keys({
  DATABASE_POSTGRESQL_PASSWORD: joi.string(), // semaphore CI
  DATABASE_POSTGRESQL_USERNAME: joi.string(), // semaphore CI
  DATABASE_URL: joi.string().uri(), // heroku
  MJ_APP_NAME: joi.string().token().default(appName),
  MJ_DEBUG_BROWSERIFY: joi.boolean().default(false),
  MJ_DEBUG_CSS: joi.boolean().default(false),
  MJ_DOCKER_HUB_USER: joi.string().default('focusaurus'),
  MJ_DOCKER_REGISTRY: joi.string().uri().valid('').default(''), // https://dub.docker.com default
  MJ_DOMAIN: joi.string().hostname().default('stage-mj.peterlyons.com'),
  MJ_EMAIL_CLIENT_ID: joi.string(),
  MJ_EMAIL_CLIENT_SECRET: joi.string(),
  MJ_EMAIL_FROM: joi.string().email().default('mjournal reports <mjournalreports@gmail.com>'),
  MJ_EMAIL_REFRESH_TOKEN: joi.string(),
  MJ_EMAIL_SERVICE: joi.string().default('gmail'),
  MJ_EMAIL_TO: joi.string().email().default('pete@peterlyons.com'),
  MJ_EMAIL_USER: joi.string().email().default('mjournalreports@gmail.com'),
  MJ_ENABLE_EMAIL: joi.boolean().default(false),
  MJ_IP: joi.string().ip().default('0.0.0.0'),
  MJ_PG_ADMIN_DATABASE: joi.string().default('postgres'),
  MJ_PG_ADMIN_PASSWORD: joi.string().default(''),
  MJ_PG_ADMIN_USER: joi.string().default('postgres'),
  MJ_PG_DATABASE: joi.string().default(appName),
  MJ_PG_HOST: joi.string().hostname().default('localhost'),
  MJ_PG_PASSWORD: joi.string().default(''),
  MJ_PG_PORT: port.default(5432),
  MJ_PG_USER: joi.string().default(process.env.DATABASE_POSTGRESQL_USERNAME || appName),
  MJ_PG_VERSION: joi.string().default('9.4'),
  MJ_PORT: port.default(9090),
  MJ_SESSION_SECRET: joi.string().default('HkpYsNTjVpXz6BthO8hN'),
  MJ_TLS_EMAIL: joi.string().email().default(''),
  MJ_VERSION: pack.version,
  MJOURNAL_DB_PORT_5432_TCP_ADDR: joi.string().hostname(), // docker linking support
  MJOURNAL_DB_PORT_5432_TCP_PORT: port // docker linking support
})
/* eslint-enable max-len */

const result = schema.validate(process.env, {stripUnknown: true})

/* istanbul ignore if */
if (result.error) {
  exports._error = 'Invalid configuration:\n' + result.error.details
    .map((error) => error.message)
    .join('.\n')
} else {
  // export each configuration key from this commonjs module
  // using joi coerced values
  Object.assign(exports, result.value)
  switch (process.env.MJ_LOG_STREAM) {
    case 'stderr':
      exports.MJ_LOG_STREAM = process.stderr
      break
    case 'stdout':
    case '-':
      exports.MJ_LOG_STREAM = process.stdout
      break
    default:
      exports.MJ_LOG_STREAM = fs.createWriteStream(process.env.MJ_LOG_STREAM)
  }
  // docker support
  exports.MJ_PG_HOST = exports.MJOURNAL_DB_PORT_5432_TCP_ADDR ||
    exports.MJ_PG_HOST
  exports.MJ_PG_PORT = exports.MJOURNAL_DB_PORT_5432_TCP_PORT ||
    exports.MJ_PG_PORT

  // semaphore CI support
  exports.MJ_PG_USER = exports.DATABASE_POSTGRESQL_USERNAME ||
    exports.MJ_PG_USER
  exports.MJ_PG_PASSWORD = exports.DATABASE_POSTGRESQL_PASSWORD ||
    exports.MJ_PG_PASSWORD

  // heroku support
  if (exports.DATABASE_URL) {
    const parsed = url.parse(exports.DATABASE_URL)
    const auth = parsed.auth.split(':')
    exports.MJ_PG_HOST = parsed.domain
    exports.MJ_PG_PORT = parsed.port || 5432
    exports.MJ_PG_USER = auth[0]
    exports.MJ_PG_PASSORD = auth[1]
    exports.MJ_PG_DATABASE = parsed.path.slice(1) // remove leading slash

    // heroku gives your main app user db admin rights
    exports.MJ_PG_ADMIN_USER = exports.MJ_PG_ADMIN_USER || exports.MJ_PG_USER
    exports.MJ_PG_ADMIN_PASSWORD = exports.MJ_PG_ADMIN_PASSWORD ||
      exports.MJ_PG_PASSWORD
  }
}
