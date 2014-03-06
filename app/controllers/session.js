var db        = require("app/db");
var express   = require("express");
var pg        = require("pg");
var PGStore   = require("connect-pg-simple")(express);

var store = new PGStore({
  conString: db.dbURL,
  pg: pg
});

function setup(app) {
  app.use(express.cookieParser());
  app.use(express.session({
    store: store,
    secret: "izd7eT6WHsPD"
  }));
  app.get("/sign-out", function(req, res) {
    req.session.destroy();
    res.redirect("/");
  });
};

module.exports = setup;
