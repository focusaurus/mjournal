var devNull = require("dev-null");
var pack = exports.pack = require("./package");
var PRODUCTION = false;
var TEST = false;
var DEVELOPMENT = false;

var appName = exports.appName = pack.name;
exports.dbUrl = "postgres://" + appName + "@localhost/" + appName;
exports.logStream = process.stdout;
exports.port = 9090;
exports.sessionSecret = "HkpYsNTjVpXz6BthO8hN";

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
