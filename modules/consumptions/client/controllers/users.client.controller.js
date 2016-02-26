'use strict';

// consumptions controller
angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users',
  function($scope, $stateParams, $location, Authentication, Users) {
    $scope.authentication = Authentication;

    // Find a list of consumptions
    $scope.find = function() {
      $scope.users = Users.query();
    };

    // Find existing Consumption
    $scope.findOne = function() {
      $scope.user = Users.get({
        userId: $stateParams.userId
      });
    };
  }
]);
