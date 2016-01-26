var presentEntry = require('./presentEntry')
var test = require('prova')

var group = 'app/entries/presentEntry'

test(group + ' should handle null', function (assert) {
  assert.equal(presentEntry(null), null)
  assert.end()
})

test(group + ' should handle empty object', function (assert) {
  assert.deepEqual(presentEntry({}).tags, [])
  assert.end()
})

test(group + ' should remove duplicate tags', function (assert) {
  assert.deepEqual(presentEntry({tags: 'one one'}).tags, ['one'])
  assert.end()
})

test(group + ' should retain order and case', function (assert) {
  var entry = {
    tags: 'zebra raccoon rabbit mouse rabbit BIRD'
  }
  assert.deepEqual(presentEntry(entry).tags, [
    'zebra',
    'raccoon',
    'rabbit',
    'mouse',
    'BIRD'
  ])
  assert.end()
})
