angular
.module('lvl.directives.tageditor', ['lvl.services'])
.directive('lvlTagEditor', ['$timeout', 'uuid', function ($timeout, uuid) {

    var css = "<style>.tag-list{  " +
"    margin: 0; " +
"    padding: 0; " +
"    list-style: none; " +
"    display: inline-block; " +
"} " +
" " +
".tag-editor { " +
"   display: inline-block; " +
"} " +
" " +
".tag-item " +
"{ " +
"    overflow: hidden; " +
"    height: auto !important; " +
"    height: 15px; " +
"    margin: 3px; " +
"    padding: 1px 3px; " +
"    background-color: #eff2f7; " +
"    color: #000; " +
"    cursor: default; " +
"    border: 1px solid #ccd5e4; " +
"    font-size: 11px; " +
"    border-radius: 5px; " +
"    -moz-border-radius: 5px; " +
"    -webkit-border-radius: 5px; " +
"    float: left; " +
"    white-space: nowrap; " +
"} " +
" " +
" .edit-tag:before { " +
"    content: 'e '; " +
"    font-size: 6pt;" +
" }" +
" " +
" .delete-tag:before { " +
"    content: 'x '; " +
"    font-size: 6pt;" +
" }" +
" " +
".tag-name " +
"{ " +
"    margin: 0; " +
"    display: inline-block; " +
"} " +
" " +
".tag-help { " +
"    color: #595959; " +
"    display: block; " +
"    margin-bottom: 2px; " +
"} " +
" " +
".tag-action { " +
"        color: white; " +
"        border-radius: 4px; " +
"        width: 12px; " +
"        height: 12px; " +
"        display:inline-block; " +
"        text-align: center; " +
"        padding-bottom:8px; " +
"        border: 1px solid gray; " +
"} " +
" " +
".edit-tag { " +
"        background-color: #004181; " +
"        color: #a3a3a3; " +
"} " +
" " +
".delete-tag { " +
"        background-color: #b40000; " +
"        color: #a3a3a3; " +
"} " +
" " +
".edit-tag:hover { " +
"        background-color: gray; " +
"        color: black; " +
"} " +
" " +
".delete-tag:hover { " +
"        background-color: gray; " +
"        color: black; " +
"} " +
" " +
".edit-tag:after { " +
"        word-spacing: 1em; " +
"} " +
"</style>";

    return {
        restrict: 'E',
        template: ' ' +
'<div class="tag-editor"> ' +
'   <div> ' +
'       <input ' +
'           type="text" ' +
'           ng-model="currentTag.Name" ' +
'           style="display: inline-block" /> ' +
'       <small class="tag-caption" ng-show="caption">{{caption}}</small> ' +
'   </div> ' +
'   <div ng-show="tags.length"> ' +
'      <ul class="tag-list"> ' +
'          <li ng-repeat="tag in tags" class="tag-item" ng-mouseover="over($event)" ng-mouseleave="out($event)" data-tag-id={{tag.Id}}> ' +
'              <p class="tag-name"> ' +
'                  {{tag.Name}} ' +
'              </p> ' +
'              <div class="tag-action delete-tag" ng-hide="readOnly" ng-click="removeTag(tag)" title="remove tag"></div> ' +
'              <div class="tag-action edit-tag" ng-hide="readOnly" ng-click="editTag(tag)" title="edit tag"></div> ' +
'          </li> ' +
'      </ul> ' +
'   </div> ' +
'</div>',
        replace: true,
        scope: {
            tags: "=",
            useDefaultCss: "@",
            readOnly: "@",
            focusInput: "@",
            caption: "@",
            onValidate: "&",
            onHover: "&",
            onHoverOut: "&"
        },
        compile: function compile(tElement, tAttrs, transclude) {
            var input = angular.element(angular.element(tElement).children(0).children(0)[0]);
            var inputId = uuid.new();
            input.attr("id", inputId);

            if (tAttrs.readOnly === 'true') {
                input.remove();
            } else {
                input.bind("blur", function(event) {
                    var scope = angular.element(this).scope();
                    scope.$apply(function() {
                        scope.addTag(event);
                    });
                });

                input.bind("keypress", function(event) {
                    var scope = angular.element(this).scope();
                    scope.$apply(function() {
                        if (event.which == 13) {
                            scope.addTag(event);
                            event.preventDefault();
                        }
                    });
                });
            }

            if (tAttrs.useDefaultCss === 'true') {
                angular.element(tElement).prepend(css);
            }

            return function postLink(scope, el, attrs, ctl) {
                var runValidation = attrs.onValidate != undefined;

                if (attrs.focusInput === 'true') {
                    document.getElementById(inputId).focus();
                }

                var hovering = false;
                scope.over = function($event) {
                    if (hovering) return;
                    hovering = true;

                    var domEl = $event.currentTarget;
                    var el = angular.element(domEl);
                    if (!el.attr("data-tag-id")) {
                        el = el.parent();
                    }

                    var id = el.attr("data-tag-id");
                    var tag = scope.tags.getByFunc(function(t) {return t.Id == id;});
                    var pos = domEl.getBoundingClientRect();
                    scope.onHover({tag: tag, elementPos: {
                                                            height: pos.height,
                                                            width: pos.width,
                                                            left: pos.left,
                                                            bottom: pos.bottom,
                                                            right: pos.right,
                                                            top: pos.top
                                                        }});
                };

                scope.out = function($event) {
                    hovering = false;

                    scope.onHoverOut();
                }

                scope.addTag = function ($event) {
                    scope.valErr = false;
                    
                    if (scope.currentTag.Name == "") return;

                    var tagValid = (runValidation && scope.onValidate({ tag: scope.currentTag })) || !runValidation;

                    if (!tagValid) return;

                    if (!scope.tags.tagExists(scope.currentTag)) {
                        scope.tags.push(scope.currentTag);
                    }

                    scope.currentTag = new tag();
                };

                scope.editTag = function (tag) {
                    scope.removeTag(tag);
                    scope.currentTag = tag;
                    document.getElementById(inputId).focus();

                    scope.onHoverOut();
                };

                scope.removeTag = function (tag) {
                    scope.tags.removeByFunc(function (t) {
                        return t.Id == tag.Id;
                    });

                    scope.onHoverOut();
                };

                scope.currentTag = new tag();
                
                function tag() {
                    return {
                        Name: "",
                        Description: "",
                        Id: uuid.new()
                    };
                }
            };
        }
    };
}]);

Array.prototype.tagExists = function(tag) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].Name == tag.Name) {
            return true;
        }
    }

    return false;
};

Array.prototype.removeByFunc = function () {
    var what, a = arguments;
    for (var ax = this.length - 1; ax >= 0; ax--) {
        what = this[ax];
        if (a[0](what)) {
            this.splice(ax, 1);
        }
    }
    return this;
};

Array.prototype.getByFunc = function() {
  var what, a = arguments;
    for (var ax = this.length - 1; ax >= 0; ax--) {
        what = this[ax];
        if (a[0](what)) {
            return what;
        }
    }
    return null;  
}