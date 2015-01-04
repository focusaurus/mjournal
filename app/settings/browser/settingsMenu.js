function settingsMenu($scope, $rootScope) {
  $scope.theme = function theme(name) {
    $rootScope.$emit("setTheme", name);
  };
}

module.exports = settingsMenu;
