keyname = require "keyname"
console.log('@bug entries-create/index module code running');
entryBody = document.querySelector ".entryBody"
entryBody.onkeydown = (event) ->
  console.log "eventBody onkeydown", event
  if keyname(event.which) == "enter" and event.shiftKey
    event.preventDefault()
    console.log('@bug saving!');
