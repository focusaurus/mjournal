#!/usr/bin/env node
var config = require('config3')
var fs = require('fs')
var mustache = require('mustache')

function render (inPath, callback) {
  var outPath = inPath.replace('.mustache', '')
  if (outPath === inPath) {
    callback(new Error('Template paths must end in .mustache file extension'))
    return
  }
  fs.readFile(inPath, 'utf8', function (error, must) {
    if (error) {
      callback(error)
      return
    }
    var output = mustache.render(must, config)
    process.stdout.write(output, 'utf8', callback)
  })
}

render(process.argv[2], process.exit)
