'use strict'

const app = require('.')
const cheerio = require('cheerio')
const request = require('supertest')(app)
const superTestSession = require('supertest-session')

function loadPage (URL, callback) {
  // request.get(URL).expect(200).end(function (error, res) {
  request.get(URL).end(function (error, res) {
    if (error) {
      callback(error, res)
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

function session () {
  return superTestSession(app)
}

exports.loadPage = loadPage
exports.session = session
