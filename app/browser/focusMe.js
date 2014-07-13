require("angular");
//http://stackoverflow.com/questions/14833326/how-to-set-focus-in-angularjs
function focusMe () {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.focusMe, function(value) {
        if(value === true) {
          element[0].focus();
          scope[attrs.focusMe] = false;
        }
      });
    }
  };
}
angular.module("mjournal").directive("focusMe", focusMe);
