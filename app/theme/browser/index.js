require('angular')

module.exports = 'mjournal.theme'

/* global angular */
angular.module(module.exports, ['mjournal.users'])
  .controller('theme', require('./themeController'))
