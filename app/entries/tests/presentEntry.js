var expect = require("chai").expect;
var presentEntry = require("../presentEntry");

describe("app/entries/presentEntry", function () {
  it("should handle null", function() {
    expect(presentEntry(null)).to.be.null;
  });
  it("should handle empty object", function() {
    expect(presentEntry({}).tags).to.eql([]);
  });
  it("should remove duplicate tags", function() {
    expect(presentEntry({tags: "one one"}).tags).to.eql(["one"]);
  });
  it("should retain order and case", function() {
    var entry = {
      tags: "zebra raccoon rabbit mouse rabbit BIRD"
    };
    expect(presentEntry(entry).tags).to.eql([
      "zebra",
      "raccoon",
      "rabbit",
      "mouse",
      "BIRD"
    ]);
  });
});
