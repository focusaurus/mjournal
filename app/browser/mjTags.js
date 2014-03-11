angular.module("mjournal").directive("mjTags", function () {
  return {
        templateUrl: "mjTags.html",
        replace: true,
        scope: {
          mjTags: "="
        },
        compile: function compile(tElement, tAttrs, transclude) {
            return function postLink(scope, el, attrs, ctl) {
              scope.remove = function(tag) {
                if (!Array.isArray(scope.mjTags)) {
                  return;
                }
                scope.mjTags = scope.mjTags.filter(function (_tag) {
                  return _tag !== tag;
                });
              };
            };
        }
    };
});
