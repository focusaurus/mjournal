var config = require("config3");
var settings = {
  client: "postgresql",
  connection: config.db
};
exports[config.NODE_ENV] = settings;
