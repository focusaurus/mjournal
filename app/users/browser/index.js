module.exports = "mjournal.users";
var angular = require("angular");
require("angular-resource");
angular.module(module.exports, ["ngResource"])
  .controller("sign-in", require("./SignInController"));
