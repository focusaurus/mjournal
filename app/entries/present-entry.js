'use strict'

const _ = require('lodash')
function presentEntry (row) {
  if (!row) {
    return row
  }
  const entry = _.clone(row)
  entry.tags = []
  const tagString = (row.tags || '').trim()
  if (!tagString) {
    return entry
  }
  entry.tags = _.uniq(tagString.split(' '))
  return entry
}

module.exports = presentEntry
