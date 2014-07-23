var _ = require('lodash');

function signInController($scope, $http, $window) {
  $scope.signIn = function signIn() {
    delete $scope.error;
    var user = _.pick($scope, "email", "password");
    $http.post("/users/sign-in", user).then(function (res) {
      $window.location.href = "/";
    }).catch(function() {
      $scope.error = "Check your email and password and try again";
    });
  };
}

module.exports = signInController;
