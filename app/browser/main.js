require("angular");
require("./editText");
require("./EntriesService");
var mjournal = angular.module("mjournal", ["editText", "EntriesService"]);
mjournal.controller("EntriesController", require("./EntriesController"));
require("./mjTags");
