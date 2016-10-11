'use strict'
const paths = require('./paths')
const tap = require('tap')

tap.same(typeof paths.app, 'string')
tap.same(typeof paths.browser, 'string')
tap.same(typeof paths.build, 'string')
tap.same(typeof paths.thirdParty, 'string')
tap.same(typeof paths.wwwroot, 'string')
