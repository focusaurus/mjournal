'use strict'

module.exports = 'mjournal.users'
require('angular')
require('angular-resource')
require('angular-quick-dialog')
var sharify = require('sharify').data

/* global angular */
angular.module(module.exports, ['ngResource', 'angularQuickDialog'])
  .value('user', sharify.user)
  .constant('sessionTtl', sharify.sessionTtl)
  .controller('signIn', require('./sign-in-controller'))
  .controller('apiKey', require('./api-key-controller'))
  .service('usersService', require('./users-service'))
  .factory('reSignInInterceptor', require('./re-sign-in-interceptor'))
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('reSignInInterceptor')
  })
