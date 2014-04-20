var paths = require("app/paths");
var expect = require("expectacle");

describe("app/paths", function() {
  it("should have the expected exported strings", function() {
    expect(paths.app).toBeString();
    expect(paths.browser).toBeString();
    expect(paths.build).toBeString();
    expect(paths.thirdParty).toBeString();
    expect(paths.views).toBeString();
    expect(paths.wwwroot).toBeString();
  });
});
