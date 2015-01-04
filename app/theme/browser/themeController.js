function themeController($rootScope, usersService) {
  $rootScope.$on("setTheme", function setTheme(event, name) {
    document.getElementById("theme").href = "/mjournal-" + name + ".css";
    usersService.update({theme: name});
  });
}

module.exports = themeController;
