# editable = ($scope) ->
#   $scope.onFocus = () ->
#     console.log "@bug onFocus", arguments

#   $scope.onBlur = ($event, entry) ->
#     entry.body = $event.srcElement.innerText

EntriesController = ($scope, $http) ->
  $http.get("/entries").success (entries) ->
    $scope.entries = entries
  $scope.onBlur = (entry) ->
    console.log "@bug onBlur", entry.body

mjournal = angular.module("mjournal", ["contenteditable"])
mjournal.controller "EntriesController", EntriesController
