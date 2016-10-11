'use strict'
const tap = require('tap')

tap.tearDown(process.exit)

const theme = require('./index')

tap.test('should expose the themes', function (test) {
  test.ok(Array.isArray(theme.themes))
  test.end()
})

tap.test('should select the default', function (test) {
  test.false(theme.isSelected({}, {name: 'nope'}))
  test.ok(theme.isSelected({}, theme.defaultTheme))
  test.end()
})

tap.test('should select a preference', function (test) {
  test.ok(theme.isSelected({theme: 'hoth'}, {name: 'hoth'}))
  test.end()
})
