var expect = require("chai").expect;
var testUtils = require("app/testUtils");
describe("app/controllers/scripts", function() {
  it("should send back some javascript", function(done) {
    testUtils
      .get("/mjournal.js")
      .expect(200)
      .expect('Content-Type', /application\/javascript/)
      .end(done);
  });
});
