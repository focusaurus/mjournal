var app = require("app");
var cheerio = require("cheerio");
var request = require("supertest")(app);
var Session = require("supertest-session")({app: app});

function loadPage(URL, callback) {
  request.get(URL).expect(200).end(function(error, res) {
    if (error) {
      callback(error);
      return;
    }
    var $ = cheerio.load(res.text);
    callback(null, $);
  });
}

function get(URL) {
  return request.get(URL);
}

function post(URL) {
  return request.post(URL);
}

exports.loadPage = loadPage;
exports.get = get;
exports.post = post;
exports.Session = Session;
