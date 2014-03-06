var ENTER = 13;

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
};

var EntriesService = angular.module("EntriesService", ["ngResource"]);

EntriesService.factory("Entries", ["$resource", entriesFactory]);

function EntriesController($scope, Entries) {
  $scope.page = 1;
  $scope.get = function() {
    Entries.get({
      page: $scope.page,
      textSearch: $scope.textSearch
    }, function(entries) {
      $scope.entries = entries;
    });
  };
  $scope.update = function(entry) {
    Entries.update(_.pick(entry, "id", "body"), function(result) {
      entry.updated = result.updated;
    });
  };
  $scope.create = function(event) {
    var entryData;
    if (event.which === ENTER && event.shiftKey && event.target.innerText) {
      entryData = {
        body: event.target.innerText,
        tags: $scope.newEntryTags
      };
      Entries.create(entryData, function(entry) {
        $scope.entries.push(entry);
      });
      event.target.innerText = "";
    }
  };
  $scope.previous = function() {
    $scope.page++;
    $scope.get();
  };
  $scope.next = function() {
    $scope.page--;
    $scope.get();
  };
  $scope.get();
  $scope.searchKeypress = function(event) {
    if (event.which === ENTER) {
      $scope.get();
    }
  };
  $scope.editTags = function(entry) {
    entry.editTags = true;
  };
  $scope.tagsKeypress = function(event, entry) {
    if (event.which === ENTER) {
      entry.editTags = false;
      Entries.update(entry);
    }
  };
};

var mjournal = angular.module("mjournal", ["editText", "EntriesService"]);

mjournal.controller("EntriesController", EntriesController);
