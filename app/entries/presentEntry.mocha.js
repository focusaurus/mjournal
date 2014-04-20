var expect = require("expectacle");
var presentEntry = require("./presentEntry");

describe("app/entries/presentEntry", function () {
  it("should handle null", function() {
    expect(presentEntry(null)).toBeNull();
  });
  it("should handle empty object", function() {
    expect(presentEntry({}).tags).toBeLike([]);
  });
  it("should remove duplicate tags", function() {
    expect(presentEntry({tags: "one one"}).tags).toBeLike(["one"]);
  });
  it("should retain order and case", function() {
    var entry = {
      tags: "zebra raccoon rabbit mouse rabbit BIRD"
    };
    expect(presentEntry(entry).tags).toBeLike([
      "zebra",
      "raccoon",
      "rabbit",
      "mouse",
      "BIRD"
    ]);
  });
});
