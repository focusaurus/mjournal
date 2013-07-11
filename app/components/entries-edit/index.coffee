agent = require "superagent"
domify = require "domify"
Editable = require "editable"
renderEntry = require "./entry"

console.log "@bug entries-edit/index running", renderEntry
setup = (element) ->
  editable = new Editable element
  editable.on "end", (body) ->
    entryId = element.getAttribute "data-id"
    element.innerText = ""
    if entryId
      console.log "@bug updating entry #{entryId} #{body.slice(0,20)}..."
      agent.put "/entries/#{entryId}", {body}, (error) ->
        return console.log error if error
        console.log "updated entry #{entryId}"
    else
      console.log "@bug creating entry #{body.slice(0,20)}..."
      agent.post "/entries", {body}, (error, res) ->
        return console.log error if error
        html = renderEntry res.body
        document.querySelector(".entries").appendChild domify(html)

nodeList = document.querySelectorAll(".entry .body")
((setup nodeList[i]) for i in [0..nodeList.length - 1])
