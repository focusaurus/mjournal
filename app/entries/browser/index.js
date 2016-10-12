module.exports = 'mjournal.entries'
/* global angular */
require('angular')
require('angular-resource')
require('ng-tags-input')
require('ng-scroll-to')

angular.module(module.exports, ['ngResource', 'ngTagsInput', 'ngScrollTo'])
  .config(function entriesConfig ($locationProvider) {
    $locationProvider.html5Mode(true)
  })
  .controller('entries', require('./entries-controller'))
  .factory('Entries', require('./entries-service'))
  .directive('editText', require('./edit-text'))
