var _ = require("lodash");
var ENTER = 13;

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
    if (event.which === ENTER && event.shiftKey && event.target.innerText) {
      var entryData = {
        body: event.target.innerText,
        tags: $scope.newEntryTags.split(" ")
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
  $scope.searchKeypress = function(event) {
    if (event.which === ENTER) {
      $scope.get();
    }
  };
  $scope.tagsKeypress = function(event, entry) {
    if (event.which === ENTER) {
      entry.tags.push(entry.newTag);
      entry.newTag = "";
      entry.addTag = false;
      Entries.update(entry);
    }
  };
  $scope.addTag = function(entry) {
    entry.addTag = true;
  };
  $scope.get();
}

module.exports = EntriesController;
