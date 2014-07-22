require("angular");
require("ng-tags-input");
require("./editText");
require("./EntriesService");
var mjournal = angular.module("mjournal", [
  "editText",
  "EntriesService",
  "ngTagsInput"
]);
mjournal.controller("EntriesController", require("./EntriesController"));
require("./focusMe");
