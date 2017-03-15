"use strict";

const _ = require("lodash");
const tap = require("tap");
const testUtils = require("./test-utils");
const theme = require("./theme");

tap.tearDown(process.exit);

let urls = ["/grid.gif", "/favicon.png"];
urls.forEach(function(url) {
  tap.test("app/index GET " + url + " should 200/image", test => {
    testUtils
      .get(url)
      .expect(200)
      .expect("Content-Type", /^image/)
      .end(test.end.bind(test));
  });
});

const names = _.map(theme.names, function(name) {
  return "-" + name;
});
names.unshift("");
names.forEach(function(themeName) {
  const uri = "/mjournal" + themeName + ".css";
  tap.test("app/index GET " + uri + " should send CSS", test => {
    testUtils
      .get(uri)
      .expect(200)
      .expect(/tags-input/)
      .expect(/quick-dialog/)
      .expect(/loading-bar/)
      // rupture media queries for +above("s")
      .expect(/media only screen and \(min-width: 400px\)/)
      .expect(/p\.body\.new/)
      .expect("Content-Type", "text/css; charset=utf-8")
      .end((error, res) => {
        tap.error(error);
        test.end();
      });
  });
});

tap.test("app/index GET /mjournal-bogus.css should 404", test => {
  testUtils.get("/mjournal-bogus.css").expect(404).end(test.end.bind(test));
});

tap.test("app/index GET /mjournal.js should send JavaScript", test => {
  testUtils
    .get("/mjournal.js")
    .expect(200)
    .expect("Content-Type", "application/javascript")
    .expect("Content-Encoding", "gzip")
    .end(test.end.bind(test));
});

tap.test(
  "app/index layout should include HTML comment with app version",
  test => {
    testUtils.loadPage("/", function(error, dom) {
      test.error(error);
      const meta = dom('meta[name="x-app-version"]');
      test.same(meta.length, 1);
      test.ok(meta.first().attr("value"));
      test.end();
    });
  }
);

tap.test("HTTP header security", test => {
  testUtils.get("/").end((error, res) => {
    test.error(error);
    test.notOk(res.headers["x-powered-by"], "should exclude X-Powered-By");
    test.same(
      res.headers["x-frame-options"],
      "DENY",
      "should send X-Frame-Options"
    );
    test.same(
      res.headers["x-content-type-options"],
      "nosniff",
      "should send X-Content-Type-Options"
    );
    test.same(
      res.headers["x-xss-protection"],
      "1",
      "should send X-XSS-Protection"
    );
    test.end();
  });
});

urls = [
  "/fonts/icomoon.eot",
  "/fonts/icomoon.svg",
  "/fonts/icomoon.ttf",
  "/fonts/icomoon.woff"
];
urls.forEach(function(uri) {
  tap.test("app/index GET " + uri + " should send a font", test => {
    testUtils
      .get(uri)
      .expect(200)
      .expect("Content-Type", /(font|svg)/)
      .end(test.end.bind(test));
  });
});
