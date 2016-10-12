'use strict'

const _ = require('lodash')

const themes = [
  {name: 'moleskine', displayName: 'Moleskine'},
  {name: 'hoth', displayName: 'Hoth'}
]
const defaultTheme = themes[0]
function isSelected (user, theme) {
  if (user.theme) {
    return theme.name === user.theme
  }
  return theme.name === defaultTheme.name
}
exports.defaultTheme = themes[0]
exports.isSelected = isSelected
exports.themes = themes
exports.names = _.map(themes, 'name')
