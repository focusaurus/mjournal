var path = require("path");

exports.app = __dirname;
exports.browser = path.normalize(__dirname + "/browser");
exports.build = path.normalize(__dirname + "/../build");
exports.project = path.normalize(__dirname + "/..");
exports.thirdParty = path.normalize(__dirname + "/../thirdParty");
exports.views = path.normalize(__dirname + "/pages");
exports.wwwroot = path.normalize(__dirname + "/../wwwroot");
