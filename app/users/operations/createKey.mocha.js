require("mocha-sinon");
var createKey = require("./createKey");
var expect = require("chaimel");
var redeemKey = require("./redeemKey");
var signUp = require("./signUp");

describe("users/operations/createKey", function () {
  it("should require a user option", function(done) {
    createKey({}, function (error) {
      expect(error).toExist();
      expect(error.status).toEqual(401);
      done();
    });
  });
});

describe("users/operations/createKey", function () {
  var user;
  var firstKey;
  before(function (done) {
    var options = {email: "createKey@example.com", password: "password"};
    signUp(options, function (error, result) {
      user = result;
      done(error);
    });
  });

  it("should create a key that can be redeemed", function(done) {
    createKey({user: user}, function (error, value) {
      expect(error).notToExist();
      expect(value).toMatch(/[a-z0-9]{20}/i);
      firstKey = value;
      redeemKey({value: firstKey}, function (error, result) {
        expect(error).notToExist();
        expect(result).toHaveProperty("email", "createkey@example.com");
        done();
      });
    });
  });

  it("should invalidate existing keys", function(done) {
    createKey({user: user}, function (error) {
      expect(error).notToExist();
      redeemKey({value: firstKey}, function (error2, user2) {
        expect(error2).notToExist();
        expect(user2).notToExist();
        done();
      });
    });
  });
});
