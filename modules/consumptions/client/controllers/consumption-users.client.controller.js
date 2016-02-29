'use strict';

// consumptions controller
angular.module('users').controller('ConsumptionUsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'ConsumptionUsers',
  function($scope, $stateParams, $location, Authentication, ConsumptionUsers) {
    $scope.authentication = Authentication;

    $scope.users = [];
    $scope.user = null;

    if($stateParams.consumptionUserId){
      $scope.user = ConsumptionUsers.get({
        'consumptionUserId': $stateParams.consumptionUserId
      });
    }else{
      $scope.users = ConsumptionUsers.query();
    }

  }
]);
