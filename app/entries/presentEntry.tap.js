'use strict'
const tap = require('tap')

var presentEntry = require('./presentEntry')

tap.same(presentEntry(null), null, 'should handle null')
tap.same(presentEntry({}).tags, [], 'should handle empty object')
tap.same(
  presentEntry({tags: 'one one'}).tags,
  ['one'],
  'should remove duplicate tags')

var entry = {
  tags: 'zebra raccoon rabbit mouse rabbit BIRD'
}
tap.same(presentEntry(entry).tags, [
  'zebra',
  'raccoon',
  'rabbit',
  'mouse',
  'BIRD'
], 'should retain order and case')
