exports.dbUrl = "postgres://mjournal@localhost/mjournal";
exports.port = 9090;
exports.sessionSecret = "HkpYsNTjVpXz6BthO8hN";

var PRODUCTION = false;
var TEST = false;
var DEVELOPMENT = false;

switch (process.env.NODE_ENV) {
  case "production":
    PRODUCTION = true;
    break;
  case "test":
    TEST = true;
    exports.dbUrl = "postgres://mjournal@localhost/mjournal-test";
    break;
  default:
    DEVELOPMENT = true;
}
exports.browserifyDebug = DEVELOPMENT;
