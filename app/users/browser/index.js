module.exports = 'mjournal.users'
require('angular')
require('angular-resource')
require('angular-quick-dialog')
var sharify = require('sharify').data

/* global angular */
angular.module(module.exports, ['ngResource', 'angularQuickDialog'])
  .value('user', sharify.user)
  .constant('sessionTtl', sharify.sessionTtl)
  .controller('signIn', require('./SignInController'))
  .controller('apiKey', require('./apiKeyController'))
  .service('usersService', require('./usersService'))
  .factory('reSignInInterceptor', require('./reSignInInterceptor'))
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('reSignInInterceptor')
  })
