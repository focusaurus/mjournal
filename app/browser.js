require("angular");
require("angular-loading-bar");

angular.module("mjournal", [
  "angular-loading-bar",
  require("app/entries/browser"),
  require("app/settings/browser"),
  require("app/users/browser"),
  require("app/theme/browser")
]);
