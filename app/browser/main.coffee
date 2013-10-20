EntriesController = ($scope, $http) ->
  $http.get("/entries").success (entries) ->
    $scope.entries = entries

mjournal = angular.module("mjournal", [])
mjournal.controller "EntriesController", EntriesController
mjournal.filter "greet", ->
  (name) -> "Hello, #{name}!"
