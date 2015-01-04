require("angular");

module.exports = "mjournal.theme";
angular.module(module.exports, ["mjournal.users"])
  .controller("theme", require("./themeController"));
