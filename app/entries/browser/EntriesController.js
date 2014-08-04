var _ = require("lodash");
var ENTER = 13;

function EntriesController($scope, $q, Entries) {
  $scope.page = 1;
  $scope.get = function get() {
    Entries.get({
      page: $scope.page,
      textSearch: $scope.textSearch
    }, function(entries) {
      $scope.entries = entries;
    });
  };
  $scope.update = function update(entry) {
    Entries.update(_.pick(entry, "id", "body"), function(result) {
      entry.updated = result.updated;
    });
  };
  $scope.autoCompleteTags = function autoCompleteTags(value) {
    var matchingTags = $scope.tags.filter(function (tag) {
      return tag.text.toLowerCase().indexOf(value.toLowerCase()) >= 0;
    });
    var deferred = $q.defer();
    deferred.resolve(matchingTags);
    return deferred.promise;
  };
  $scope.create = function(event) {
    //Not angular but meh
    var bodyElement = document.querySelector("p.body.new");
    if (event.which === ENTER && event.shiftKey && bodyElement.innerText) {
      var entryData = {
        body: bodyElement.innerText,
        tags: _.pluck($scope.newEntryTags, "text")
      };
      bodyElement.focus();
      Entries.create(entryData, function(entry) {
        $scope.entries.push(entry);
        bodyElement.innerText = "";
      });
    }
  };
  $scope.previous = function previous() {
    $scope.page++;
    $scope.get();
  };
  $scope.next = function next() {
    $scope.page--;
    $scope.get();
  };
  $scope.searchKeypress = function searchKeypress(event) {
    if (event.which === ENTER) {
      $scope.get();
    }
  };
  $scope.updateTags = function updateTags(entry, newTag) {
    var forUpdate = _.pick(entry, "id");
    forUpdate.tags = entry.tags.map(function (tag) {
      return tag.text;
    });
    Entries.update(forUpdate);
    if (newTag) {
      var haveIt = $scope.tags.some(function (tag) {
        return tag.text.toLowerCase() === newTag.text.toLowerCase();
      });
      if (!haveIt) {
        $scope.tags.push(newTag);
      }
    }
  };
  $scope.get();
  $scope.tags = Entries.get({id: "tags"});
}

module.exports = EntriesController;
