#!/usr/bin/env node
'use strict'

const autoprefixer = require('autoprefixer-stylus')
const config = require('config3')
const errors = require('httperrors')
const fs = require('fs')
const join = require('path').join
const paths = require('../paths')
const rupture = require('rupture')
const stylus = require('stylus')
const theme = require('../theme')

function render (name, callback) {
  name = name || theme.defaultTheme.name
  if (theme.names.indexOf(name) < 0) {
    callback(new errors.NotFound('No theme named ' + name))
    return
  }
  const stylPath = join(paths.app, 'theme', name, 'app.styl')
  fs.readFile(stylPath, 'utf8', function (error, stylusText) {
    if (error) {
      return callback(error)
    }
    stylus(stylusText)
      .include(paths.app)
      .include(paths.bower)
      .include(paths.wwwroot)
      .use(rupture())
      .use(autoprefixer())
      .set('include css', true)
      .set('filename', stylPath)
      .set('sourcemap', {inline: config.MJ_DEBUG_CSS})
      .render(callback)
  })
}

function main () {
  render('moleskine', function (error, cssText) {
    if (error) {
      console.error(error)
      return
    }
    console.log(cssText)
  })
}

if (require.main === module) {
  main()
}

module.exports = render
