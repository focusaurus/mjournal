'use strict'

function apiKey ($scope, $http) {
  $scope.getKey = function getKey () {
    $http.post('/api/users/key').then(function (res) {
      $scope.apiKey = res.data.key
    }).catch(function (res) {
      switch (res.status) {
        case 401:
          $scope.error = 'Sign in to the web app first then try again'
          break
        case 409:
          $scope.error = 'That email is already registered. Try signing in.'
          break
        default:
          $scope.error = 'Unable to generate an API key right now'
      }
    })
  }
}

module.exports = apiKey
