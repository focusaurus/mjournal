var theme = require("app/theme");

function settingsMenu($scope, user) {
  $scope.themes = theme.themes; // for the template
  function computeSelected() {
    theme.themes.forEach(function(it) {
      it.selected = theme.isSelected(user, it);
    });
  }
  $scope.setTheme = function setTheme(name) {
    user.theme = name;
    computeSelected();
  };
  computeSelected();
}

module.exports = settingsMenu;
