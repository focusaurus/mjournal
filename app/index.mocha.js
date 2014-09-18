var testUtils = require("app/testUtils");
var expect = require("expectacle");

describe("app/index site-wide routes", function() {
  ["/grid.gif", "/tag.png"].forEach(function(url) {
    it("GET " + url + " should 200/image", function(done) {
      testUtils.get(url)
        .expect(200)
        .expect("Content-Type", /image/)
        .end(done);
    });
  });

  it("GET /mjournal.css should send CSS", function(done) {
    this.timeout(2000); //Sorry. FS IO
    testUtils
      .get("/mjournal.css")
      .expect(200)
      .expect("Content-Type", "text/css; charset=utf-8")
      .expect(/tags-input/)
      .expect(/p\.body\.new/)
      .end(done);
  });

  it("GET /mjournal.js should send JavaScript", function(done) {
    this.timeout(10000); //Sorry. Browserify has lots of FS IO
    testUtils
      .get("/mjournal.js")
      .expect(200)
      .expect("Content-Type", "text/javascript")
      .end(done);
  });

  it("layout should include HTML comment with app version", function (done) {
    testUtils.loadPage("/", function (error, dom) {
      expect(error).toBeFalsy();
      expect(dom("meta[name=x-app-version]").length).toEqual(1);
      done();
    });
  });
});
