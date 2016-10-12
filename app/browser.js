'use strict'

require('angular')
require('angular-loading-bar')

/* global angular */
angular.module('mjournal', [
  'angular-loading-bar',
  require('./entries/browser'),
  require('./settings/browser'),
  require('./users/browser'),
  require('./theme/browser')
])
