function recompute(page, list) {
  if (!Array.isArray(list)) {
    page.disablePrevious = true;
    page.disableNext = true;
    return;
  }
  page.disablePrevious = page.number === 1;
  page.disableNext = list.length < page.size;
}

function paginated($scope, listName) {
  $scope.page = {
    number: 1,
    size: 50,
    disablePrevious: true,
    disableNext: true
  };
  $scope.page.previous = function previous() {
    $scope.page.number--;
    if ($scope.page.number < 1) {
      $scope.page.number = 1;
    }
  };
  $scope.page.next = function next() {
    $scope.page.number++;
  };
  var boundRecompute = recompute.bind(null, $scope.page);
  $scope.$watch(listName, boundRecompute);
  $scope.$watch("page.number", boundRecompute);
}

module.exports = paginated;
