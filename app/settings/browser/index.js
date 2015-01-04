module.exports = "mjournal.settings";
require("angular");
require("angular-ui-bootstrap-dropdown");

angular.module(module.exports, ["ui.bootstrap.dropdown"])
  .controller("settingsMenu", require("./settingsMenu"));
