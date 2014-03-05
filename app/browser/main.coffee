ENTER = 13
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
    if event.which is ENTER and event.shiftKey and event.target.innerText
      entryData =
        body: event.target.innerText
        tags: $scope.newEntryTags
      Entries.create entryData, (entry) ->
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
    if event.which is ENTER
      $scope.get()
  $scope.editTags = (entry) ->
    entry.editTags = true
  $scope.tagsKeypress = (event, entry) ->
    if event.which is ENTER
      entry.editTags = false
      Entries.update entry

mjournal = angular.module("mjournal", ["editText", "EntriesService"])
mjournal.controller "EntriesController", EntriesController
