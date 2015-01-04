var expect = require("chaimel");
var theme = require("./index");

describe("app/theme/index", function () {

  it("should expose the themes", function() {
    expect(theme).toHaveProperty("themes").thatIsAn("array");
  });

  it("should select the default", function() {
    expect(theme.isSelected({}, {name: "nope"})).toBeFalse();
    expect(theme.isSelected({}, theme.defaultTheme)).toBeTrue();
  });

  it("should select a preference", function() {
    expect(theme.isSelected({theme: "hoth"}, {name: "hoth"})).toBeTrue();
  });
});
