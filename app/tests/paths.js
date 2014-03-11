var paths = require("app/paths");
var expect = require("chai").expect;

describe("app/paths", function() {
  it("should have the expected exported strings", function() {
    expect(paths.app).to.be.a("string");
    expect(paths.browser).to.be.a("string");
    expect(paths.build).to.be.a("string");
    expect(paths.thirdParty).to.be.a("string");
    expect(paths.views).to.be.a("string");
    expect(paths.wwwroot).to.be.a("string");
  });
});
