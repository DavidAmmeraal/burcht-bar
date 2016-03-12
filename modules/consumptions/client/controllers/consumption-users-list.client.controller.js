'use strict';

// consumptions controller
angular.module('users').controller('ConsumptionUsersListController', ['$scope', '$stateParams', '$location', 'Authentication', 'ConsumptionUsers',
  function($scope, $stateParams, $location, Authentication, ConsumptionUsers) {

    $scope.authentication = Authentication;

    $scope.fields = [
      {
        'field': 'displayName',
        'label': 'Naam',
        'sorting': 0
      },
      {
        'field': 'balance',
        'label': 'Balans',
        'filter': 'customCurrency:€',
        'sorting': 0,
        'default': true
      }
    ];

    $scope.sorting = {};

    $scope.setSorting = function(field){
      angular.forEach($scope.fields, function(cField){
        if(cField === field){
          cField.sorting = cField.sorting ? -cField.sorting : -1;
          $scope.sorting = {};
          $scope.sorting[cField.field] = cField.sorting;
        }else{
          cField.sorting = 0;
        }
      });
      $scope.find();
    };

    $scope.find = function(){
      $scope.users = ConsumptionUsers.query({
        sort: $scope.sorting
      });
    };

    $scope.setSorting(_.find($scope.fields, function(val){
      return val.default;
    }));

  }

]);
