var _ = require("lodash");
var devNull = require("dev-null");

var pack = exports.pack = require("./package");
var PRODUCTION = false;
var TEST = false;
var DEVELOPMENT = false;

var appName = exports.appName = pack.name;
exports.hostname = process.env.HOSTNAME || "mjournal.peterlyons.com";
exports.nodeVersion = pack.engines.node;
var figHost = process.env.MJOURNAL_DB_1_PORT_5432_TCP_ADDR;
var figPort = process.env.MJOURNAL_DB_1_PORT_5432_TCP_PORT;
exports.db = {
  host: figHost || "localhost",
  port: parseInt(figPort || 5432, 10),
  user: appName,
  database: appName,
  password: appName
};
exports.postgres = _.clone(exports.db);
exports.postgres.user = "postgres";
exports.postgres.password = "postgres";
exports.postgres.database = "postgres";
exports.logStream = process.stdout;
exports.port = 9090;
exports.sessionSecret = "HkpYsNTjVpXz6BthO8hN";

switch (process.env.NODE_ENV) {
  case "production":
    PRODUCTION = true;
    break;
  case "test":
    TEST = true;
    exports.db.database = appName + "test";
    exports.db.user = appName + "test";
    exports.db.password = appName + "test";
    exports.logStream = devNull();
    break;
  default:
    DEVELOPMENT = true;
}
exports.browserifyDebug = DEVELOPMENT;
