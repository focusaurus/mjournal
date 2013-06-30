keyname = require "keyname"
entryBody = document.querySelector ".entryBody"
entryBody.onkeydown = (event) ->
  if keyname(event.which) == "enter" and event.shiftKey
    event.preventDefault()
    console.log('@bug saving!');
