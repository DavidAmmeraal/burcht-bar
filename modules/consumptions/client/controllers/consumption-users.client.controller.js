'use strict';

// consumptions controller
angular.module('users').controller('ConsumptionUsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'ConsumptionUsers',
  function($scope, $stateParams, $location, Authentication, ConsumptionUsers) {

    $scope.authentication = Authentication;

    $scope.users = [];
    $scope.user = null;

    if($stateParams.barcode){
      $scope.user = ConsumptionUsers.get({
        'barcode': $stateParams.barcode
      });
    }else{
      $scope.users = ConsumptionUsers.query();
    }

  }
]);
