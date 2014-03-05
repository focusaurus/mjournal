#!/usr/bin/env coffee
fs = require "fs"
log = require "app/log"
paths = require "app/paths"
stylus = require "stylus"

render = (callback) ->
  fs.readFile "#{paths.app}/app.styl", "utf8", (error, stylusText) ->
    return callback error if error
    stylus.render stylusText, callback

main = ->
  render (error, cssText) ->
    if error
      return console.error error
    console.log cssText

appCSS = (req, res, next) ->
  render (error, cssText) ->
    if error
      log.error {err: error}, "Error rendering CSS"
      next "Error rendering CSS"
      return
    res.type "css"
    res.send cssText

setup = (app) ->
  app.get "/app.css", appCSS

main() if require.main == module
module.exports = setup
