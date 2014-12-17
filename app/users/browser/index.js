module.exports = "mjournal.users";
var angular = require("angular");
require("angular-resource");
require("angular-quick-dialog");

angular.module(module.exports, ["ngResource", "angularQuickDialog"])
  .controller("sign-in", require("./SignInController"))
  .factory("reSignInInterceptor", require("./reSignInInterceptor"))
  .config(function($httpProvider) {
    $httpProvider.interceptors.push("reSignInInterceptor");
  });
