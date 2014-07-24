module.exports = "mjournal.entries";
if (typeof angular !== "undefined") {
  require("angular-resource");
  require("ng-tags-input");
  angular.module(module.exports, ["ngResource", "ngTagsInput"])
    .controller("entries", require("./EntriesController"))
    .factory("Entries", require("./EntriesService"))
    .directive("editText", require("./editText"));
}
