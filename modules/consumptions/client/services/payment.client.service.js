'use strict';

//Consumptions service used for communicating with the consumptions REST endpoints
angular.module('consumptions').factory('Payments', ['$resource',
  function ($resource) {
    return $resource('api/payments/:paymentId', {
      paymentId: '@_id'
    });
  }
]);
