'use strict'

const backoff = require('backoff')
const config = require('config3')
const errors = require('../errors')
const knex = require('knex')
const log = require('../log')
const db = module.exports = knex({
  client: 'pg',
  connection: {
    database: config.MJ_PG_DATABASE,
    host: config.MJ_PG_HOST,
    password: config.MJ_PG_PASSWORD,
    port: config.MJ_PG_PORT,
    user: config.MJ_PG_USER
  }
})

function forceReconnect (callback) {
  db.raw('select now()').then(callback)
}

const call = backoff.call(forceReconnect, function (error) {
  if (error) {
    log.info({retries: call.getNumRetries()}, 'backoff.call errored')
    return
  }
  log.info('backoff.call succeeded. Resetting.')
  call.reset()
})

call.on('backoff', function () {
  log.info('Db backoff happening')
})
call.setStrategy(new backoff.ExponentialStrategy())

function connectionError (error) {
  if (errors.canWithstand(error)) {
    if (call.isPending()) {
      call.start()
    }
    return
  }
  // Time to die
  throw error
}

function afterCreate (connection, callback) {
  connection.on('error', connectionError)
  callback(null, connection)
}

db.client.pool.config.afterCreate = afterCreate
