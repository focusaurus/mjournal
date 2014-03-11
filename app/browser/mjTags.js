angular.module("mjournal").directive("mjTags", function () {
  return {
        restrict: "A",
        templateUrl: "mjTags.html",
        replace: true,
        scope: {
          mjTags: "="
        },
        compile: function compile(tElement, tAttrs, transclude) {
            return function postLink(scope, el, attrs, ctl) {
              console.log("@bug postLink called");
            };
        }
    };
});
