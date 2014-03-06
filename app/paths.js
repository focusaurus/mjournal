var path = require("path");

module.exports = {
  app: __dirname,
  build: path.normalize(__dirname + "/../build"),
  project: path.normalize(__dirname + "/.."),
  wwwroot: path.normalize(__dirname + "/../wwwroot"),
  browser: path.normalize(__dirname + "/browser")
};
