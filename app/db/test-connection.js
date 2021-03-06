#!/usr/bin/env node
'use strict'

const config = require('config3')
const knex = require('knex')

const appDb = knex({
  client: 'pg',
  connection: {
    database: config.MJ_PG_DATABASE,
    host: config.MJ_PG_HOST,
    password: config.MJ_PG_PASSWORD,
    port: config.MJ_PG_PORT,
    user: config.MJ_PG_USER
  }
})
const adminDb = knex({
  client: 'pg',
  connection: {
    database: config.MJ_PG_ADMIN_DATABASE,
    host: config.MJ_PG_HOST,
    password: config.MJ_PG_ADMIN_PASSWORD,
    port: config.MJ_PG_PORT,
    user: config.MJ_PG_ADMIN_USER
  }
})
const adminUrl = `postgres://${config.MJ_PG_ADMIN_USER}@${config.MJ_PG_HOST}:${config.MJ_PG_PORT}/${config.MJ_PG_ADMIN_DATABASE}` // eslint-disable-line max-len
const appUrl = `postgres://${config.MJ_PG_USER}@${config.MJ_PG_HOST}:${config.MJ_PG_PORT}/${config.MJ_PG_DATABASE}` // eslint-disable-line max-len
adminDb.raw('select 1')
.then(() => {
  console.log(`connected to admin db ${adminUrl}`)
  return appDb.raw('select 1')
})
.then(() => {
  console.log(`connected to app db ${appUrl}`)
  process.exit()
})
.catch((error) => {
  console.error('Connection error: ', error)
  process.exit(10)
})
