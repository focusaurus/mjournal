var dailySummary = require("./dailySummary");
var expect = require("chaimel");

describe("reports/dailySummary", function () {
  it("should have the correct fields and numbers", function(done) {
    dailySummary(function (error, result) {
      expect(error).toBeNull();
      [
        "entriesCreated",
        "entriesUpdated",
        "totalEntries",
        "usersCreated",
        "totalUsers"].forEach(function(property) {
        expect(result).toHaveProperty(property).thatIsA("number");
      });
      done();
    });
  });
});
