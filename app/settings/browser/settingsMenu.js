function settingsMenu($scope) {
  $scope.theme = function theme(name) {
    $scope.$broadcast("setTheme", name);
  };
}

module.exports = settingsMenu;
