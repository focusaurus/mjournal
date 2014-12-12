var paths = require("./paths");
var expect = require("chaimel");

describe("app/paths", function() {
  it("should have the expected exported strings", function() {
    expect(paths.app).toBeA("string");
    expect(paths.browser).toBeA("string");
    expect(paths.build).toBeA("string");
    expect(paths.thirdParty).toBeA("string");
    expect(paths.wwwroot).toBeA("string");
  });
});
