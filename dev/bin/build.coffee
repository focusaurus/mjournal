fs = require("fs")
Builder = require("component-builder")
jade = require("component-jade")
builder = new Builder "#{__dirname}/../.."
builder.use jade
builder.build (err, res) ->
  throw err  if err
  fs.writeFileSync "build/build.js", res.require + res.js
