var _ = require('lodash')
var async = require('async')
var config = require('config3')
// eslint bug thinks "crypto" is a global from the browser
// https://github.com/eslint/eslint/issues/1059
var crypt = require('crypto')
var fs = require('fs')
var knex = require('knex')
var log = require('app/log')
var path = require('path')
var util = require('util')

var db = require('./index')
var postgres = knex({client: 'pg', connection: config.postgres})
var ALREADY = [
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
    var statements = ddl.split(';')
    async.eachSeries(statements, async.apply(runDdl, db), callback)
  })
}

function ensureDatabase (callback) {
  // http://stackoverflow.com/a/17431573/266795
  var passwordMd5Hex = 'md5' + crypt.createHash('md5')
      .update(config.db.password + config.db.user).digest('hex')
  var createRole = util.format(
    "create role %s login encrypted password '%s'",
    config.db.user,
    passwordMd5Hex
  )
  var createDatabase = util.format(
    'create database "%s" owner %s', config.db.database, config.db.user)
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
  var ddlPaths = [
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
