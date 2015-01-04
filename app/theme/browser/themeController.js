function themeController($rootScope) {
  $rootScope.$on("setTheme", function setTheme(event, name) {
    document.getElementById("theme").href = "/mjournal-" + name + ".css";
  });
}

module.exports = themeController;
