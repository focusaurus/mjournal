function themeController($scope, usersService, user) {
  $scope.user = user;
  $scope.$watch("user.theme", function (name) {
    document.getElementById("theme").href = "/mjournal-" + name + ".css";
    usersService.update({theme: name});
  });
}

module.exports = themeController;
