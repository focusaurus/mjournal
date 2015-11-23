require('angular')
require('angular-loading-bar')

/* global angular */
angular.module('mjournal', [
  'angular-loading-bar',
  require('app/entries/browser'),
  require('app/settings/browser'),
  require('app/users/browser'),
  require('app/theme/browser')
])
