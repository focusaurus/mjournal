var test = require('tape')
var theme = require('./index')

var group = 'app/theme/index'
test(group + 'should expose the themes', function (assert) {
  assert.ok(Array.isArray(theme.themes))
  assert.end()
})

test(group + 'should select the default', function (assert) {
  assert.false(theme.isSelected({}, {name: 'nope'}))
  assert.ok(theme.isSelected({}, theme.defaultTheme))
  assert.end()
})

test(group + 'should select a preference', function (assert) {
  assert.ok(theme.isSelected({theme: 'hoth'}, {name: 'hoth'}))
  assert.end()
})
