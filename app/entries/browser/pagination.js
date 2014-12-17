var fs = require("fs");
/*eslint no-path-concat:0*/
var paginationTemplate = fs.readFileSync(__dirname + "/pagination.ng.html");

function recompute($scope) {
  if (!Array.isArray($scope.array)) {
    $scope.disableNext = true;
    $scope.disablePrevious = true;
    return;
  }
  $scope.disableNext = $scope.array.length < $scope.size;
  $scope.disablePrevious = $scope.currentPage === 1;
  if ($scope.reverse) {
    $scope.disableNext = !$scope.disableNext;
    $scope.disablePrevious = !$scope.disablePrevious;
  }
}

function link($scope, $element, attrs) {
  $scope.currentPage = 1;
  $scope.size = 50;
  $scope.disableNext = true;
  $scope.disablePrevious = true;
  $scope.label = attrs.label;
  $scope.reverse = attrs.direction === "reverse";
  $scope.previous = function previous() {
    $scope.currentPage--;
    if ($scope.currentPage < 1) {
      $scope.currentPage = 1;
    }
    $scope.$emit("previous");
  };
  $scope.next = function next() {
    $scope.currentPage++;
    $scope.$emit("next");
  };
  var boundRecompute = recompute.bind(null, $scope);
  $scope.$watch("array", boundRecompute);
  $scope.$watch("currentPage", boundRecompute);
}

function pagination() {
  return {
    restrict: "E",
    link: link,
    template: paginationTemplate,
    scope: {
      array: "=?"
    }
  };
}

module.exports = pagination;
