var _ = require("lodash");
var ENTER = 13;
var ESCAPE = 27;

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
  $scope.newTagKeydown = function(event, entry) {
    function close() {
      entry.newTag = "";
      entry.addTag = false;
    }
    if (event.which === ESCAPE) {
      close();
      return;
    }
    if (event.which === ENTER) {
      entry.tags.push(entry.newTag);
      Entries.update(entry);
      close();
      return;
    }
  };
  $scope.$on("mjTags:remove", function (event, entry, removedTag) {
    Entries.update(_.pick(entry, "id", "tags"));
  });
  $scope.get();
}

module.exports = EntriesController;
