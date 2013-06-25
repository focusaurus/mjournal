#!/usr/bin/env coffee
fs = require "fs"
log = require("winston").loggers.get("app:controllers:styles")
stylus = require "stylus"

render = (callback) ->
  fs.readFile "#{__dirname}/../app.styl", "utf8", (error, stylusText) ->
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
      log.error "Error rendering CSS #{error}"
      return next "Error rendering CSS"
    res.type "css"
    res.send cssText

setup = (app) ->
  app.get "/app.css", appCSS

main() if require.main == module
module.exports = setup
