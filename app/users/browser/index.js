module.exports = "mjournal.users";
if (typeof angular !== "undefined") {
  require("angular-resource");
  angular.module(module.exports, ["ngResource"])
    .controller("sign-in", require("./SignInController"));
}
