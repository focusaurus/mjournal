entriesFactory = ($resource) ->
  $resource "/entries/:id", {id: "@id"},
      get:
        method: "GET"
        isArray: true
      update:
        method: "PUT"
      create:
        method: "POST"
EntriesService = angular.module("EntriesService", ["ngResource"])
EntriesService.factory "Entries", ["$resource", entriesFactory]
EntriesController = ($scope, Entries) ->
  $scope.page = 1
  $scope.get = ->
    Entries.get {page: $scope.page, textSearch: $scope.textSearch}, (entries) ->
      $scope.entries = entries
  $scope.update = (entry) ->
    Entries.update _.pick(entry, "id", "body"), (result) ->
      entry.updated = result.updated
  $scope.create = (event) ->
    if event.which is 13 and event.shiftKey and event.target.innerText
     Entries.create {body: event.target.innerText}, (entry) ->
        $scope.entries.push(entry)
      event.target.innerText = ""
  $scope.previous = ->
    $scope.page++
    $scope.get()
  $scope.next = ->
    $scope.page--
    $scope.get()
  $scope.get()
  $scope.searchKeypress = (event) ->
    if event.which is 13
      $scope.get()

mjournal = angular.module("mjournal", ["editText", "EntriesService"])
mjournal.controller "EntriesController", EntriesController
