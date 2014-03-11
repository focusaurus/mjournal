require("angular-resource");
function entriesFactory($resource) {
  return $resource("/entries/:id", {
    id: "@id"
  }, {
    get: {
      method: "GET",
      isArray: true
    },
    update: {
      method: "PUT"
    },
    create: {
      method: "POST"
    }
  });
}

var EntriesService = angular.module("EntriesService", ["ngResource"]);

EntriesService.factory("Entries", ["$resource", entriesFactory]);
module.exports = EntriesService;
