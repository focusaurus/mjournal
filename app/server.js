#!/usr/bin/env node

// HEY! The order of this early code has been carefully considered.
// Do not change unless you know what you are doing

var errors = require('./errors')
process.on('uncaughtException', errors.onUncaughtException)

var config = require('config3')
var validateConfig = require('./validateConfig')
var valid = validateConfig(config)
if (valid.error) {
  console.error(valid.error.details, 'Config is invalid. Process will exit.')
  process.exit(33)
}

var _ = require('lodash')
var log = require('./log')
log.debug({
  env: process.env.NODE_ENV,
  db: _.omit(config.db, 'password')
},
  '%s server process starting', config.pack.name)
var app = require('.')
var server

function gracefulShutdown () {
  log.info('server doing graceful shutdown due to kill signal')
  if (!server) {
    process.exit()
  }
  server.close(function onClose () {
    log.debug('server connections gracefully closed. Exting.')
    process.exit()
  })

  // Max 10s to clean up before forced exit
  var exitTimeout = setTimeout(function exitTimeout () {
    log.debug('server exiting abruptly. Connections did not complete quickly.')
    process.exit(10)
  }, 10 * 1000)

  // but don't keep the process alive just for the exit timer
  exitTimeout.unref()
}
process.on('SIGTERM', gracefulShutdown)

require('./emails/scheduled').run()
var setup = require('./db/setup')
setup.init(function (error) {
  if (error) {
    log.error(error, 'Error ensuring database is ready. Process will exit.')
    setTimeout(process.exit.bind(null, 20), 1000)
  }
  server = app.listen(config.port, config.ip, function (error2) {
    if (error2) {
      log.error(error2, 'Unable to bind network socket. Exiting')
      /*eslint no-process-exit:0*/
      setTimeout(process.exit.bind(null, 10), 1000)
    }
    log.info(
      _.pick(config, 'ip', 'port'),
      '%s express app listening', config.pack.name
    )
  })
})
