#!/usr/bin/env node
'use strict'

// HEY! The order of this early code has been carefully considered.
// Do not change unless you know what you are doing

const errors = require('./errors')
process.on('uncaughtException', errors.onUncaughtException)

const config = require('config3')
const log = require('./log')
const main = require.main === module

// if starting the real server and the config isn't valid, exit right away
/* istanbul ignore if */
if (main && config._error) {
  log.fatal(config._error)
  process.exit(33) // eslint-disable-line no-process-exit
}

const _ = require('lodash')
log.debug({
  env: process.env.NODE_ENV,
  db: _.pick(config, 'MJ_PG_HOST', 'MJ_PG_DATABASE')
},
  '%s server process starting', config.MJ_APP_NAME)
const app = require('.')
let server

function immediateExit () {
  log.error('2nd SIGINT received. Exiting now.')
  process.exit(11)
}

function gracefulExit (error) {
  let exitCode = 10
  if (error) {
    log.error(error, 'unhandled error. Server will close and exit.')
  } else {
    log.info('server doing graceful shutdown due to signal')
    exitCode = 0
  }
  if (!server) {
    // never started listening. OK to just exit.
    process.exit(exitCode)
  }
  server.close(function onClose () {
    log.debug('server connections gracefully closed. Exiting.')
    process.exit(exitCode)
  })

  // Max 10s to clean up before forced exit
  const exitTimeout = setTimeout(function exitTimeout () {
    log.debug('server exiting abruptly. Connections did not complete quickly.')
    process.exit(10)
  }, 10 * 1000)

  // but don't keep the process alive just for the exit timer
  exitTimeout.unref()

  // If another SIGINT arrives during grace period, GTFO
  process.on('SIGINT', immediateExit)
}
/* eslint-enable no-process-exit */
process.once('uncaughtException', gracefulExit)
process.once('SIGINT', gracefulExit) // CTRL-C in terminal, pm2
process.on('SIGTERM', gracefulExit) // docker

require('./emails/scheduled').run()
const setup = require('./db/setup')
setup.init(function (error) {
  if (error) {
    log.error(error, 'Error ensuring database is ready. Process will exit.')
    setTimeout(process.exit.bind(null, 20), 1000)
  }
  server = app.listen(config.MJ_PORT, config.MJ_IP, function (error2) {
    if (error2) {
      log.error(error2, 'Unable to bind network socket. Exiting')
      /*eslint no-process-exit:0*/
      setTimeout(process.exit.bind(null, 10), 1000)
    }
    log.info(
      _.pick(config, 'ip', 'port'),
      '%s express app listening', config.MJ_APP_NAME
    )
  })
})
