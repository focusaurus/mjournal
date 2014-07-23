/*
Based on https://github.com/akatov/angular-contenteditable but simplified
to not care about HTML
@see http://docs.angularjs.org/guide/concepts
@see http://docs.angularjs.org/api/ng.directive:ngModel.NgModelController
@see https://github.com/angular/angular.js/issues/528#issuecomment-7573166
*/

function editText() {
  return {
    restrict: "A",
    require: "?ngModel",
    link: function($scope, $element, attrs, ngModel) {
      if (!ngModel) {
        return;
      }
      $element.attr("contenteditable", true);
      $element.removeAttr("edittext");
      $element.bind("blur", function(event) {
        $scope.$apply(function() {
          ngModel.$setViewValue(event.target.innerText);
          ngModel.$render();
        });
      });
      $element.bind("keydown", function(event) {
        if (event.which === 13 && event.shiftKey) {
          event.preventDefault();
          if (event.target && event.target.blur) {
            event.target.blur();
          }
        }
      });
      var oldRender = ngModel.$render;
      ngModel.$render = function() {
        if (oldRender) {
          oldRender();
        }
        $element.text(ngModel.$viewValue || "");
      };
    }
  };
}
module.exports = editText;
