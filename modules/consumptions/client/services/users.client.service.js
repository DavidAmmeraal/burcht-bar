'use strict';

//Consumptions service used for communicating with the consumptions REST endpoints
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users/:consumptionId', {
      userId: '@_id'
    }, {
    });
  }
]);
