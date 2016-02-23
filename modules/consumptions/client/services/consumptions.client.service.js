'use strict';

//Consumptions service used for communicating with the consumptions REST endpoints
angular.module('consumptions').factory('Consumptions', ['$resource',
  function ($resource) {
    return $resource('api/consumptions/:consumptionId', {
      consumptionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
