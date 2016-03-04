'use strict';

// consumptions controller
angular.module('consumptions').controller('PaymentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Payments', 'ConsumptionUsers',
  function($scope, $stateParams, $location, Authentication, Payments, ConsumptionUsers) {
    $scope.authentication = Authentication;
    $scope.amount = 0;
    $scope.submitted = false;

    $scope.submitPaymentForm = function(isValid){
      if(isValid && $scope.user){
        var payment = new Payments({
          amount: $scope.amount,
          user: $scope.user.barcode
        });

        payment.$save(function(response){
          $scope.amount = 0;
          $scope.submitted = true;
        });
        console.log(payment);
      }
    };
    // Create new Consumption
    $scope.create = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'paymentForm');

        return false;
      }

      // Create new Consumption object
      var payment = new Payments({});

      // Redirect after save
      payment.$save(function(response) {
      //  $location.path('consumptions/' + response._id);
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
          $scope.payments = Payments.query(params);
        });
      }else{
        $scope.payments = Payments.query();
      }
    };

    // Find existing Consumption
    $scope.findOne = function() {
      $scope.payment = Payments.get({
        consumptionId: $stateParams.paymentId
      });
    };
  }
]);
