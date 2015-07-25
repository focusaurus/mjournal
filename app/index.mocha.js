var _ = require('lodash')
var testUtils = require('app/testUtils')
var expect = require('chaimel')
var theme = require('app/theme')

describe('app/index site-wide routes', function () {
  ['/grid.gif', '/favicon.png'].forEach(function (url) {
    it('GET ' + url + ' should 200/image', function (done) {
      testUtils.get(url)
        .expect(200)
        .expect('Content-Type', /^image/)
        .end(done)
    })
  })

  var names = _.map(theme.names, function (name) {
    return '-' + name
  })
  names.unshift('')
  names.forEach(function (themeName) {
    var uri = '/mjournal' + themeName + '.css'
    it('GET ' + uri + ' should send CSS', function (done) {
      this.timeout(2000); // Sorry. FS IO
      testUtils
        .get(uri)
        .expect(200)
        .expect('Content-Type', 'text/css; charset=utf-8')
        .expect(/tags-input/)
        .expect(/loading-bar/)
        // rupture media queries for +above("s")
        .expect(/media only screen and \(min-width: 400px\)/)
        .expect(/p\.body\.new/)
        .end(done)
    })
  })

  it('GET /mjournal-bogus.css should 404', function (done) {
    testUtils
      .get('/mjournal-bogus.css')
      .expect(404)
      .end(done)
  })

  it('GET /mjournal.js should send JavaScript', function (done) {
    testUtils
      .get('/mjournal.js')
      .expect(200)
      .expect('Content-Type', 'application/javascript')
      .expect('Content-Encoding', 'gzip')
      .end(done)
  })

  it('layout should include HTML comment with app version', function (done) {
    testUtils.loadPage('/', function (error, dom) {
      expect(error).notToExist()
      expect(dom('meta[name=x-app-version]').length).toEqual(1)
      done()
    })
  })

  it('GET /docs should include API docs', function (done) {
    testUtils.loadPage('/docs', function (error, dom) {
      expect(error).notToExist()
      expect(dom.html()).toContain('Authorization: key')
      done()
    })
  });[
    '/fonts/icomoon.eot',
    '/fonts/icomoon.svg',
    '/fonts/icomoon.ttf',
    '/fonts/icomoon.woff'
  ].forEach(function (uri) {
    it('GET ' + uri + ' should send a font', function (done) {
      testUtils
        .get(uri)
        .expect(200)
        .expect('Content-Type', /(font|svg)/)
        .end(done)
    })
  })
})
