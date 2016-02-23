'use strict';

// Configuring the Consumptions module
angular.module('consumptions').run(['Menus',
  function (Menus) {
    // Add the consumptions dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Consumptions',
      state: 'consumptions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'consumptions', {
      title: 'List Consumptions',
      state: 'consumptions.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'consumptions', {
      title: 'Create Consumption',
      state: 'consumptions.create',
      roles: ['user']
    });
  }
]);
