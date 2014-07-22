var path = require("path");

exports.app = __dirname;
exports.bower = path.normalize(path.join(__dirname, "..", "bower_components"));
exports.browser = path.normalize(path.join(__dirname, "browser"));
exports.build = path.normalize(path.join(__dirname, "..", "build"));
exports.project = path.normalize(path.join(__dirname, ".."));
exports.thirdParty = path.normalize(path.join(__dirname, "..", "thirdParty"));
exports.wwwroot = path.normalize(path.join(__dirname, "..", "wwwroot"));
