
EntriesController = ($scope, $http) ->
  $http.get("/entries").success (entries) ->
    $scope.entries = entries
  $scope.onBlur = (entry) ->
    # $http.put("/entries/#{entry.id}", {body: entry.body}).success (result) ->
    #   entry.updated = result.updated

mjournal = angular.module("mjournal", ["editText"])
mjournal.controller "EntriesController", EntriesController
