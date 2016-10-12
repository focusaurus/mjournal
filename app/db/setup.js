'use strict'

const _ = require('lodash')
const async = require('async')
const config = require('config3')
// eslint bug thinks "crypto" is a global from the browser
// https://github.com/eslint/eslint/issues/1059
const crypt = require('crypto')
const fs = require('fs')
const knex = require('knex')
const log = require('../log')
const path = require('path')
const util = require('util')

const db = require('./index')
const postgres = knex({
  client: 'pg',
  connection: {
    database: config.MJ_PG_ADMIN_DATABASE,
    host: config.MJ_PG_HOST,
    password: config.MJ_PG_ADMIN_PASSWORD,
    port: config.MJ_PG_PORT,
    user: config.MJ_PG_ADMIN_USER
  }
})
const ALREADY = [
  '3D000',
  '42501', // permission denied to create role (heroku)
  '42710', // role already exists
  '42P04', // database already exists
  '42P07', // table already exists
  '42P16' // re-adding an existing primary key constraint
]

function alreadyExists (error) {
  return error && _.includes(ALREADY, error.code)
}

function runDdl (onDb, ddl, callback) {
  if (!ddl.trim()) {
    setImmediate(callback)
    return
  }
  log.debug({ddl: ddl}, 'running db init DDL')
  onDb.raw(ddl).exec(function (error, result) {
    if (alreadyExists(error)) {
      log.debug('recognized an already exists error code')
      callback(null, result)
      return
    }
    callback(error, result)
  })
}

function runFile (ddlPath, callback) {
  log.debug({path: ddlPath}, 'running db init DDL file')
  fs.readFile(ddlPath, 'utf8', function (error, ddl) {
    if (error) {
      callback(error)
      return
    }
    const statements = ddl.split(';')
    async.eachSeries(statements, async.apply(runDdl, db), callback)
  })
}

function ensureDatabase (callback) {
  // http://stackoverflow.com/a/17431573/266795
  const passwordMd5Hex = 'md5' + crypt.createHash('md5')
    .update(config.MJ_PG_PASSWORD + config.MJ_PG_USER).digest('hex')
  const createRole = util.format(
    "create role %s login encrypted password '%s'",
    config.MJ_PG_USER,
    passwordMd5Hex
  )
  const createDatabase = util.format(
    'create database "%s" owner %s', config.MJ_PG_DATABASE, config.MJ_PG_USER)
  async.eachSeries(
    [createRole, createDatabase],
    runDdl.bind(null, postgres),
    function (error, result) {
      if (error && error.code === '28P01') {
        log.debug(error, 'Admin authentication to DB failed. ' +
          'Continuing with app user assuming DB already exists.')
        // authentication failed
        // presume role & database have already been setup
        // move on to schema
        callback()
        return
      }
      callback(error, result)
    }
  )
}

function ensureSchema (callback) {
  const ddlPaths = [
    path.join(__dirname, '../users/users.ddl'),
    path.join(__dirname, '../entries/entries.ddl')
  ]
  async.eachSeries(ddlPaths, runFile, callback)
}

function init (callback) {
  async.series([ensureDatabase, ensureSchema], function (error, result) {
    if (error && error.code === '28P01') {
      // bad credentials
      log.error(error, 'Database credentials are incorrect!')
    }
    // If we don't do this and the DB is stopped, this app will get an
    // uncaught exception from the postgres connection
    postgres.destroy()
    callback(error, result)
  })
}

module.exports = {
  init: init,
  ensureDatabase: ensureDatabase,
  ensureSchema: ensureSchema,
  runDdl: runDdl,
  runFile: runFile,
  postgres: postgres
}

if (require.main === module) {
  init(() => {})
}
