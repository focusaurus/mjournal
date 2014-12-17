module.exports = "mjournal.users";
var angular = require("angular");
require("angular-resource");
require("angular-quick-dialog");
var sharify = require("sharify").data;

angular.module(module.exports, ["ngResource", "angularQuickDialog"])
  .constant("sessionTtl", sharify.sessionTtl)
  .controller("sign-in", require("./SignInController"))
  .factory("reSignInInterceptor", require("./reSignInInterceptor"))
  .config(function($httpProvider) {
    $httpProvider.interceptors.push("reSignInInterceptor");
  });
