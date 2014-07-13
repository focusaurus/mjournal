var fs = require("fs");
//Inspiration:
//https://jasonturim.wordpress.com/2013/09/22/angularjs-native-tag-editor/
require("angular");
function mjTags() {
  return {
        /*eslint no-path-concat:0*/
        template: fs.readFileSync(__dirname + "/mjTags.html", "utf8"),
        replace: true,
        scope: {
          mjTags: "="
        },
        compile: function compile() {
            return function postLink(scope) {
              scope.remove = function(tag) {
                if (!Array.isArray(scope.mjTags.tags)) {
                  return;
                }
                scope.mjTags.tags = scope.mjTags.tags.filter(function (_tag) {
                  return _tag !== tag;
                });
                scope.$emit("mjTags:remove", scope.mjTags, tag);
              };
            };
        }
    };
}
angular.module("mjournal").directive("mjTags", mjTags);
