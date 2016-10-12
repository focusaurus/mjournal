#!/usr/bin/env node
const config = require('config3')

if (config.MJ_PG_DATABASE !== 'mjournal_test') {
  console.error('Refusing to wipe non-test DB.' +
    ' Edit this wipe.js script if you seriously want to wipe a dev/prod DB')
  process.exit(10)
}
// enable the next line to see logging during the wipe
// const config = require('config3'); config.MJ_LOG_STREAM = process.stdout

const async = require('async')
const log = require('../log')
const path = require('path')
const setup = require('./setup')

const WIPE_DDL = path.join(__dirname, 'wipe.ddl')

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
