var _ = require('lodash')
function presentEntry (row) {
  if (!row) {
    return row
  }
  var entry = _.clone(row)
  entry.tags = []
  var tagString = (row.tags || '').trim()
  if (!tagString) {
    return entry
  }
  entry.tags = _.uniq(tagString.split(' '))
  return entry
}

module.exports = presentEntry
