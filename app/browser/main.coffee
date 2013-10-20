  mjournal = angular.module("mjournal", [])

  mjournal.filter "greet", ->
    (name) -> "Hello, #{name}!"
