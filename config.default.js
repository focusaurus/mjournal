var devNull = require("dev-null");
var pack = exports.pack = require("./package");
var PRODUCTION = false;
var TEST = false;
var DEVELOPMENT = false;

var appName = exports.appName = pack.name;
exports.hostname = process.env.HOSTNAME || "mjournal.peterlyons.com";
exports.nodeVersion = pack.engines.node;
//exports.sshPublicKey = false;
exports.db = {
  protocol: "postgres",
  host: "localhost",
  port: 5432,
  user: appName,
  database: appName,
  password: ""
};
exports.adminDb = {
  protocol: "postgres",
  host: "localhost",
  port: 5432,
  user: "postgres",
  database: "postgres",
  password: ""
};
exports.dbUrl = process.env.DB_PORT ||
  "postgres://" + appName + "@localhost/" + appName;
exports.dbUrl = exports.dbUrl.replace("tcp://", "postgres://postgres@") + "/" + appName;
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
