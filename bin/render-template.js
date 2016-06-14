#!/usr/bin/env node
'use strict'

const config = require('config3')
const fs = require('fs')
const mustache = require('mustache')

let must
try {
  must = fs.readFileSync(process.argv[2], 'utf8') // eslint-disable-line no-sync
} catch (error) {
  console.error(error)
  process.exit(10) // eslint-disable-line no-process-exit
}
const output = mustache.render(must, config)
process.stdout.write(output, 'utf8')
