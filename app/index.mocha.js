var testUtils = require("app/testUtils");
var expect = require("chaimel");

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
      .expect(/loading-bar/)
      .expect(/p\.body\.new/)
      .end(done);
  });

  it("GET /mjournal.js should send JavaScript", function(done) {
    testUtils
      .get("/mjournal.js")
      .expect(200)
      .expect("Content-Type", "application/javascript")
      .expect("Content-Encoding", "gzip")
      .end(done);
  });

  it("layout should include HTML comment with app version", function (done) {
    testUtils.loadPage("/", function (error, dom) {
      expect(error).notToExist();
      expect(dom("meta[name=x-app-version]").length).toEqual(1);
      done();
    });
  });
});
