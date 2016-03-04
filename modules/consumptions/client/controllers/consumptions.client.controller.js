'use strict';

// consumptions controller
angular.module('consumptions').controller('ConsumptionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Consumptions', 'ConsumptionUsers',
  function($scope, $stateParams, $location, Authentication, Consumptions, ConsumptionUsers) {
    $scope.authentication = Authentication;

    // Create new Consumption
    $scope.create = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'consumptionForm');

        return false;
      }

      // Create new Consumption object
      var consumption = new Consumptions({});

      // Redirect after save
      consumption.$save(function(response) {
        $location.path('consumptions/' + response._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Consumption
    $scope.remove = function(consumption) {
      if (consumption) {
        consumption.$remove();

        for (var i in $scope.consumptions) {
          if ($scope.consumptions[i] === consumption) {
            $scope.consumptions.splice(i, 1);
          }
        }
      } else {
        $scope.consumption.$remove(function() {
          $location.path('consumptions');
        });
      }
    };

    // Update existing Consumption
    $scope.update = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'consumptionForm');

        return false;
      }

      var consumption = $scope.consumption;

      consumption.$update(function() {
        $location.path('consumptions/' + consumption._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of consumptions
    $scope.find = function() {
      if($scope.user){
        $scope.user.$promise.then(function(){
          var params = {
            user: $scope.user.barcode
          };
          $scope.consumptions = Consumptions.query(params);
        });
      }else{
        $scope.consumptions = Consumptions.query();
      }
    };

    $scope.toggleCheckAll = function() {
      if ($scope.checkAll) {
        $scope.checkAll = true;
      } else {
        $scope.checkAll = false;
      }
      angular.forEach($scope.consumptions, function(consumption) {
        consumption.checked = $scope.checkAll;
      });
      console.log($scope.consumptions);
    };

    // Find existing Consumption
    $scope.findOne = function() {
      $scope.consumption = Consumptions.get({
        consumptionId: $stateParams.consumptionId
      });
    };
  }
]);
