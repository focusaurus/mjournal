var app = require("express")();
var log = require("app/log");
var config = require("config3");

require("app/controllers")(app);

app.listen(config.port, function(error) {
  if (error) {
    log.fatal("Unable to bind network socket. Exiting", {
      err: error
    });
    process.exit(10);
  }
  log.info({
    port: config.port
  }, "mjournal express app listening");
});
module.exports = app;
