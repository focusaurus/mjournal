var app = require('app')
var cheerio = require('cheerio')
var request = require('supertest')(app)
var Session = require('supertest-session')({app: app})

function loadPage (URL, callback) {
  request.get(URL).expect(200).end(function (error, res) {
    if (error) {
      callback(error)
      return
    }
    var $ = cheerio.load(res.text)
    callback(null, $)
  })
}

['get', 'post', 'put'].forEach(function (method) {
  exports[method] = function methodWrapper (url) {
    return request[method](url)
  }
})

exports.loadPage = loadPage
exports.Session = Session
