keyname = require "keyname"
agent = require "superagent"
value = require "value"
entryBody = document.querySelector ".entryBody"
entryBody.onkeydown = (event) ->
  if keyname(event.which) == "enter" and event.shiftKey
    event.preventDefault()
    body = value entryBody
    console.log('@bug saving', body.length, 'characters');
    agent.post "/entries", {body}, (error, res) ->
      return console.log error if error
      console.log "Created entry #{res.body.id} #{res.body.created}"
