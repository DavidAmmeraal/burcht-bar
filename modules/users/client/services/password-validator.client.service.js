'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function(password) {
        //var result = owaspPasswordStrengthTest.test(password);
        var strongRegex = new RegExp('^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$', 'g');
        var mediumRegex = new RegExp('^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$', 'g');
        var enoughRegex = new RegExp('(?=.{6,}).*', 'g');

        var result = {
          passed: false
        };
        if (strongRegex.test(password)) {
          result.passed = true;
          result.strength = 'strong';
        } else if (mediumRegex.test(password)) {
          result.passed = true;
          result.strength = 'medium';
        } else if (enoughRegex.test(password)) {
          result.passed = true;
          result.strength = 'weak';
        } else {
          result.passed = false;
          result.strength = 'none';
        }

        return result;
      },
      getPopoverMsg: function() {
        var popoverMsg = 'Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.';
        return popoverMsg;
      }
    };
  }
]);
