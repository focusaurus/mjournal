var paths = require("app/paths");

function setup(app) {
  app.set("view engine", "jade");
  app.set("views", paths.views);
  app.router;
  [
    "styles",
    "scripts",
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
