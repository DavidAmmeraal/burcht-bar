'use strict';
angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.requirements = function (password) {
          if (password) {
            var result = PasswordValidator.getResult(password);

            // Requirements Meter - visual indicator for users
            var colorMappings = {
              'none': 'danger',
              'weak': 'warning',
              'medium': 'info',
              'strong': 'success'
            };
            scope.requirementsColor = colorMappings[result.strength];
            scope.requirementsStrength = result.strength;
            return result.passed;
          }
          return false;
        };
      }
    };
  }]);
