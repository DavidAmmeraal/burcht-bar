'use strict';

angular.module('users')
  .directive('barcode', ['$window', function($window) {
    return {
      require: 'ngModel',
      link: function($scope, element, attributes, ngModel) {

        var initialize = function(){
          if(ngModel.$modelValue){
            $window.JsBarcode(element[0], ngModel.$modelValue);
          }
        };

        $scope.$watch(function(){
          return ngModel.$modelValue;
        }, initialize);


      }
    };
  }]);
