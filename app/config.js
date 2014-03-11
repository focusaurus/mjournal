var PRODUCTION = process.env.NODE_ENV === "production";
exports.browserifyDebug = !PRODUCTION;
