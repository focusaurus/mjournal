
EntriesController = ($scope, $http) ->
  $http.get("/entries").success (entries) ->
    $scope.entries = entries
  $scope.update = (entry) ->
    $http.put("/entries/#{entry.id}", {body: entry.body}).success (result) ->
      entry.updated = result.updated
  $scope.create = (event) ->
    if event.which is 13 and event.shiftKey and event.target.innerText
     $http.post("/entries", {body: event.target.innerText}).success (entry) ->
        $scope.entries.push(entry)
      event.target.innerText = ""

mjournal = angular.module("mjournal", ["editText"])
mjournal.controller "EntriesController", EntriesController
