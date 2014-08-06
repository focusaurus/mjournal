var pack = exports.pack = require("./package");
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
    exports.logStream = devNull();
    break;
  default:
    DEVELOPMENT = true;
}
exports.browserifyDebug = DEVELOPMENT;
exports.dbUrl = "postgres://" + pack.name + "@localhost/" + pack.name;
exports.logStream = process.stdout;
exports.port = 9090;
exports.sessionSecret = "HkpYsNTjVpXz6BthO8hN";
