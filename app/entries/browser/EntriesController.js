var _ = require("lodash");
var ENTER = 13;
var PAGE_SIZE = 50;

function EntriesController($scope, $q, $location, Entries) {
  $scope.get = function get(params) {
    params = params || {};
    params.textSearch = $scope.textSearch;

    Entries.get(params, function(entries) {
      // if ($scope.page.number > 1) {
      //   $location.search("topEntry", entries[0].id);
      // }
      $scope.disableNext = $scope.disablePrevious = false;
      $scope.entries = entries;
      if (entries.length < PAGE_SIZE) {
        if (params.before) {
          $scope.disablePrevious = true;
        }
        if (params.after) {
          $scope.disableNext = true;
        }
      }
    });
  };

  $scope.previous = function previous() {
    var topEntry = $scope.entries[0];
    var params = {before: topEntry && topEntry.id};
    $scope.get(params);
  };

  $scope.next = function next() {
    var bottomEntry = _.last($scope.entries);
    var params = {after: bottomEntry && bottomEntry.id};
    $scope.get(params);
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
  $scope.entries = [];
  $scope.get();
  $scope.tags = Entries.get({id: "tags"});
}

module.exports = EntriesController;
