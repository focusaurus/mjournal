function setup(app) {
  var controller, controllers, _i, _len;
  app.set("view engine", "jade");
  app.set("views", "" + __dirname + "/../pages");
  app.router;
  [
    "styles",
    "static",
    "session",
    "../users/controller",
    "../entries/controller"
  ].forEach(function(controller) {
    require("./" + controller)(app);
  });
  app.use(app.router);
};

module.exports = setup;
