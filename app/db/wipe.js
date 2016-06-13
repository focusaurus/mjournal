#!/usr/bin/env node
if (process.env.NODE_ENV !== 'test') {
  console.error('Refusing to wipe non-test DB.' +
    ' Edit this wipe.js script if you seriously want to wipe a dev/prod DB')
  /* eslint no-process-exit:0 */
  process.exit(10)
}
// enable these lines to see logging during the wipe
// var config = require("config3")
// config.logStream = process.stdout

var async = require('async')
var log = require('../log')
var path = require('path')
var setup = require('./setup')

var WIPE_DDL = path.join(__dirname, 'wipe.ddl')

log.info('wiping test database')
async.series([
  setup.ensureDatabase,
  setup.runFile.bind(null, WIPE_DDL),
  setup.ensureSchema
], function (error) {
  if (error) {
    log.error(error, 'Error wiping test database')
    process.exit(20)
  }
  log.debug('test database wiped successfully')
  process.exit()
})
