'use strict';

// consumptions controller
angular.module('consumptions').controller('consumptionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Consumptions',
  function ($scope, $stateParams, $location, Authentication, Consumptions) {
    $scope.authentication = Authentication;

    // Create new Consumption
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'consumptionForm');

        return false;
      }

      // Create new Consumption object
      var consumption = new Consumptions({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      consumption.$save(function (response) {
        $location.path('consumptions/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Consumption
    $scope.remove = function (consumption) {
      if (consumption) {
        consumption.$remove();

        for (var i in $scope.consumptions) {
          if ($scope.consumptions[i] === consumption) {
            $scope.consumptions.splice(i, 1);
          }
        }
      } else {
        $scope.consumption.$remove(function () {
          $location.path('consumptions');
        });
      }
    };

    // Update existing Consumption
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'consumptionForm');

        return false;
      }

      var consumption = $scope.consumption;

      consumption.$update(function () {
        $location.path('consumptions/' + consumption._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of consumptions
    $scope.find = function () {
      $scope.consumptions = Consumptions.query();
    };

    // Find existing Consumption
    $scope.findOne = function () {
      $scope.consumption = Consumptions.get({
        consumptionId: $stateParams.consumptionId
      });
    };
  }
]);
