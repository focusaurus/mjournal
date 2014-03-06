var app = require("express")();
var log = require("app/log");

if ((process.env.NODE_ENV || "development") === "development") {
  app.set("config.development", true);
}

require("app/controllers")(app);

var port = process.env.MJ_EXPRESS_PORT || 9090;

app.listen(port, function(error) {
  if (error) {
    log.fatal("Unable to bind network socket. Exiting", {
      err: error
    });
    process.exit(10);
  }
  log.info({
    port: port
  }, "mjournal express app listening");
});
