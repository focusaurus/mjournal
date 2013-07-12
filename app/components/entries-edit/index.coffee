agent = require "superagent"
domify = require "domify"
Editable = require "editable"
renderEntry = require "./entry"

setup = (element) ->
  editable = new Editable element
  editable.on "end", (body) ->
    entryId = element.getAttribute "data-id"
    if entryId
      console.log "@bug updating entry #{entryId} #{body.slice(0,20)}..."
      agent.put "/entries/#{entryId}", {body}, (error) ->
        return console.log error if error
    else
      console.log "@bug creating entry #{body.slice(0,20)}..."
      element.innerText = ""
      agent.post "/entries", {body}, (error, res) ->
        return console.log error if error
        html = renderEntry res.body
        newElement = domify(html)
        setup newElement.querySelector(".body")
        document.querySelector(".entries").appendChild newElement

nodeList = document.querySelectorAll(".body")
((setup nodeList[i]) for i in [0..nodeList.length - 1])
