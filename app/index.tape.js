var test = require('tape')
var _ = require('lodash')
var testUtils = require('app/testUtils')
var theme = require('app/theme')

var urls = ['/grid.gif', '/favicon.png']
urls.forEach(function (url) {
  test('app/index GET ' + url + ' should 200/image', function (assert) {
    testUtils.get(url)
      .expect(200)
      .expect('Content-Type', /^image/)
      .end(assert.end.bind(assert))
  })
})

var names = _.map(theme.names, function (name) {
  return '-' + name
})
names.unshift('')
names.forEach(function (themeName) {
  var uri = '/mjournal' + themeName + '.css'
  test('app/index GET ' + uri + ' should send CSS', function (assert) {
    testUtils
      .get(uri)
      .expect(200)
      .expect('Content-Type', 'text/css; charset=utf-8')
      .expect(/tags-input/)
      .expect(/loading-bar/)
      // rupture media queries for +above("s")
      .expect(/media only screen and \(min-width: 400px\)/)
      .expect(/p\.body\.new/)
      .end(assert.end.bind(assert))
  })
})

test('app/index GET /mjournal-bogus.css should 404', function (assert) {
  testUtils
    .get('/mjournal-bogus.css')
    .expect(404)
    .end(assert.end.bind(assert))
})

test('app/index GET /mjournal.js should send JavaScript', function (assert) {
  testUtils
    .get('/mjournal.js')
    .expect(200)
    .expect('Content-Type', 'application/javascript')
    .expect('Content-Encoding', 'gzip')
    .end(assert.end.bind(assert))
})

test(
  'app/index layout should include HTML comment with app version',
  function (assert) {
    testUtils.loadPage('/', function (error, dom) {
      assert.error(error)
      assert.equal(dom('meta[name="x-app-version"]').length, 1)
      assert.end()
    })
  })

urls = [
  '/fonts/icomoon.eot',
  '/fonts/icomoon.svg',
  '/fonts/icomoon.ttf',
  '/fonts/icomoon.woff'
]
urls.forEach(function (uri) {
  test('app/index GET ' + uri + ' should send a font', function (assert) {
    testUtils
      .get(uri)
      .expect(200)
      .expect('Content-Type', /(font|svg)/)
      .end(assert.end.bind(assert))
  })
})
