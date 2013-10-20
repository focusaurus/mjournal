###
Based on https://github.com/akatov/angular-contenteditable but simplified
to not care about HTML
@see http://docs.angularjs.org/guide/concepts
@see http://docs.angularjs.org/api/ng.directive:ngModel.NgModelController
@see https://github.com/angular/angular.js/issues/528#issuecomment-7573166
###
editText = ($timeout) ->
  restrict: "A"
  require: "?ngModel"
  link: ($scope, $element, attrs, ngModel) ->

    # don't do anything unless this is actually bound to a model
    return  unless ngModel
    $element.attr "contenteditable", true
    $element.removeAttr("edittext")
    # view -> model
    $element.bind "blur", (event) -> $scope.$apply ->
      ngModel.$setViewValue event.target.innerText
      ngModel.$render()

    $element.bind "keydown", (event) -> $scope.$apply ->
      if event.which is 13 and event.shiftKey
        event.preventDefault()
        this.element.blur()

    # model -> view
    oldRender = ngModel.$render
    ngModel.$render = ->
      oldRender()  unless not oldRender
      $element.text ngModel.$viewValue or ""

angular.module("editText", [])
  .directive "edittext", ["$timeout", editText ]
