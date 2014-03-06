var express = require("express");
var paths = require("app/paths");

function setup(app) {
  app.use(express["static"](paths.wwwroot));
  app.use(express["static"](paths.browser));
};

module.exports = setup;
