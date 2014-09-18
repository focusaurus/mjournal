var _ = require("lodash");
var devNull = require("dev-null");
var pack = require("./package");
var config = exports;

config.pack = pack;
config.NODE_ENV = process.env.NODE_ENV || "development";
var appName = config.appName = pack.name;
config.appVersion = pack.version;
config.hostname = process.env.HOSTNAME || "mjournal.peterlyons.com";
config.nodeVersion = pack.engines.node;
config.registry = "docker.stage.peterlyons.com:5000";
var figHost = process.env.MJOURNAL_DB_PORT_5432_TCP_ADDR;
var figPort = process.env.MJOURNAL_DB_PORT_5432_TCP_PORT;
config.db = {
  host: figHost || "localhost",
  port: parseInt(figPort || 5432, 10),
  user: appName,
  database: appName,
  password: appName
};
config.postgres = _.clone(config.db);
config.postgres.user = "postgres";
config.postgres.password = "postgres";
config.postgres.database = "postgres";
config.logStream = process.stdout;
config.port = 9090;
config.session = {
  secret: "HkpYsNTjVpXz6BthO8hN",
  cookie: {
    httpOnly: true,
    secure: false
  }
};

switch (config.NODE_ENV) {
  case "production":
    config.registry = "docker.peterlyons.com:5000";
    break;
  case "test":
    config.db.database = appName + "test";
    config.db.user = appName + "test";
    config.db.password = appName + "test";
    config.logStream = devNull();
    break;
  default:
    config.browserifyDebug = true;
}
