'use strict';

// Setting up route
angular.module('consumptions').config(['$stateProvider',
  function ($stateProvider) {
    // consumptions state routing
    $stateProvider
      .state('consumptions', {
        abstract: true,
        url: '/consumptions',
        template: '<ui-view/>'
      })
      .state('consumptions.list', {
        url: '',
        templateUrl: 'modules/consumptions/client/views/list-consumptions.client.view.html'
      })
      .state('consumptions.create', {
        url: '/create',
        templateUrl: 'modules/consumptions/client/views/create-consumption.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('consumptions.view', {
        url: '/:consumptionId',
        templateUrl: 'modules/consumptions/client/views/view-consumption.client.view.html'
      })
      .state('consumptions.edit', {
        url: '/:consumptionId/edit',
        templateUrl: 'modules/consumptions/client/views/edit-consumption.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('consumption-users', {
        abstract: true,
        url: '/consumption-users',
        template: '<ui-view/>'
      })
      .state('consumption-users.list', {
        url: '',
        templateUrl: 'modules/consumptions/client/views/list-consumption-users.client.view.html'
      })
      .state('consumption-users.barcodes', {
        url: '/barcodes',
        templateUrl: 'modules/consumptions/client/views/list-barcodes.client.view.html'
      })
      .state('consumption-users.view', {
        url: '/:barcode',
        templateUrl: 'modules/consumptions/client/views/view-consumption-user.client.view.html'
      });

  }
]);
