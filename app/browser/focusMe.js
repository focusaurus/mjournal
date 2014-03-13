require("angular");
//http://stackoverflow.com/questions/14833326/how-to-set-focus-in-angularjs
angular.module("mjournal").directive("focusMe", function($timeout) {
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
});
