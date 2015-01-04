require("angular");

module.exports = "mjournal.theme";
angular.module(module.exports, [])
  .controller("theme", require("./themeController"));
