var expect = require("chaimel");
var signUp = require("app/users/operations/signUp");
var update = require("app/users/operations/update");

describe("users/operations/update", function() {
  it("should update email and theme", function(done) {
    var newUser = {
      email: "test/users/operations/update@example.com",
      password: "password"
    };
    signUp(newUser, function(error, user) {
      expect(error).toBeNull();
      expect(user).toHaveProperty("id");
      var changes = {
        user: user,
        email: "test/users/operations/update2@example.com",
        theme: "hoth"
      };
      update(changes, function (error, updatedUser) {
        expect(error).notToExist();
        expect(updatedUser).toHaveProperty("theme", "hoth");
        done();
      });
    });
  });
});
