'use strict';

//Consumptions service used for communicating with the consumptions REST endpoints
angular.module('users').factory('ConsumptionUsers', ['$resource',
  function($resource) {
    return $resource('api/consumption-users/:consumptionUserId', {
      consumptionUserId: '@_id'
    });
  }
]);
