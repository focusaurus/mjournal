'use strict'

const path = require('path')

function full () {
  return path.normalize(path.join.apply(path, arguments))
}

exports.app = full(__dirname)
exports.browser = full(__dirname, 'browser')
exports.build = full(__dirname, '..', 'build')
exports.project = full(__dirname, '..')
exports.wwwroot = full(__dirname, '..', 'wwwroot')
