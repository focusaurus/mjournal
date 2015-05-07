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
config.envName = "stage";
config.db = {
  host: process.env.MJOURNAL_DB_PORT_5432_TCP_ADDR || "localhost",
  port: parseInt(process.env.MJOURNAL_DB_PORT_5432_TCP_PORT || 5432, 10),
  user: appName,
  database: appName,
  password: appName
};
config.postgres = _.clone(config.db);
config.postgres.version = "9.4";
config.postgres.user = "postgres";
config.postgres.password = "password";
config.postgres.database = "postgres";
config.logStream = process.stdout;
config.port = 9090;
config.ip = "127.0.0.1";
config.registry = "docker.peterlyons.com:5000";
config.session = {
  secret: "HkpYsNTjVpXz6BthO8hN",
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 1, // one day in milliseconds
    secure: false
  }
};
config.email = {
  enabled: false,
  service: "gmail",
  to: "pete@peterlyons.com",
  from: "mjournal reports <mjournalreports@gmail.com>",
  auth: {
    xoauth2: {
      user: "mjournalreports@gmail.com",
      clientId: "",
      clientSecret: "",
      refreshToken: "",
      timeout: 3600
    }
  }
};
config.css = {
  debug: true
};
switch (config.NODE_ENV) {
  case "production":
    config.envName = "production";
    config.ip = "0.0.0.0";
    config.logStream = process.stdout;
    config.css.debug = false;
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
