var _ = require("lodash");

var ENTER = 13;
var PAGE_SIZE = 50;

function EntriesController($scope, $q, $location, Entries) {
  $scope.get = function get() {
    var params = $location.search();
    Entries.get(params, function(entries) {
      $scope.disableNext = $scope.disablePrevious = false;
      $scope.entries = entries;
      if (entries.length < PAGE_SIZE) {
        if (!params.before && !params.after) {
          //on home page, disable both
          $scope.disablePrevious = $scope.disableNext = true;
        }
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
    $location.search("before", params.before);
    $location.search("after", null);
    $scope.get();
  };

  $scope.next = function next() {
    var bottomEntry = _.last($scope.entries);
    var params = {after: bottomEntry && bottomEntry.id};
    $location.search("after", params.after);
    $location.search("before", null);
    $scope.get();
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

  $scope.create = function create(event) {
    //Not angular but meh
    var bodyElement = document.querySelector("p.body.new");
    var doCreate = bodyElement.innerText &&
      (event === true || (event.which === ENTER && event.shiftKey));
    if (doCreate) {
      var entryData = {
        body: bodyElement.innerText,
        tags: _.pluck($scope.newEntryTags, "text")
      };
      bodyElement.focus();
      Entries.create(entryData, function(entry) {
        $scope.entries.push(entry);
        bodyElement.innerText = "";
      });
      $scope.newEntryTags.forEach($scope.addAutocompleteTag);
    }
  };

  $scope.searchKeypress = function searchKeypress(event) {
    if (event.which === ENTER) {
      $location.search("before", null);
      $location.search("after", null);
      $location.search("textSearch", $scope.textSearch);
      $scope.get();
    }
  };

  $scope.clearTextSearch = function clearTextSearch() {
    $scope.textSearch = "";
    $location.search("before", null);
    $location.search("after", null);
    $location.search("textSearch", null);
    $scope.get();
  };

  $scope.updateTags = function updateTags(entry) {
    var forUpdate = _.pick(entry, "id");
    forUpdate.tags = entry.tags.map(function (tag) {
      return tag.text;
    });
    entry.tags.forEach($scope.addAutocompleteTag);
    Entries.update(forUpdate);
  };

  $scope.addAutocompleteTag = function addAutocompleteTag(newTag) {
    var haveIt = $scope.tags.some(function (tag) {
      return tag.text.toLowerCase() === newTag.text.toLowerCase();
    });
    if (!haveIt) {
      $scope.tags.push(newTag);
    }
  };

  $scope.clickTag = function clickTag(event) {
    var target = event.target;
    var isTagSpan = target.tagName === "SPAN" && target.childNodes.length === 1;
    if (isTagSpan) {
      event.preventDefault();
      $scope.textSearch = target.innerText;
      $location.search("textSearch", target.innerText);
      $location.search("before", null);
      $location.search("after", null);
      $scope.get();
    }
  };

  $scope.entries = [];
  $scope.textSearch = $location.search().textSearch || "";
  $scope.get();
  $scope.tags = Entries.get({id: "tags"});
}

module.exports = EntriesController;
