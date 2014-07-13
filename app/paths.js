var path = require("path");

exports.app = __dirname;
exports.browser = path.normalize(path.join(__dirname, "browser"));
exports.build = path.normalize(path.join(__dirname, "..", "build"));
exports.project = path.normalize(path.join(__dirname, ".."));
exports.thirdParty = path.normalize(path.join(__dirname, "..", "thirdParty"));
exports.wwwroot = path.normalize(path.join(__dirname, "..", "wwwroot"));
