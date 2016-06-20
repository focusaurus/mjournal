#!/usr/bin/env node
'use strict'

const knex = require('knex')

const config = require('config3')
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

appDb.raw('select 1')
  .then(() => {
    console.log('connected to app db',
      `${config.MJ_PG_USER}@${config.MJ_PG_HOST}`)
  }
)
  .catch(console.error)
adminDb.raw('select 1')
  .then(() => {
    console.log('connected to admin db',
      `${config.MJ_PG_ADMIN_USER}@${config.MJ_PG_HOST}`)
  }
)
  .catch(console.error)
