'use strict';

// Configuring the Consumptions module
angular.module('consumptions').run(['Menus',
  function (Menus) {
    // Add the consumptions dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Gebruikers',
      state: 'users.list',
      type: 'item',
      roles: ['user', 'admin']
    });

    Menus.addMenuItem('topbar', {
      title: 'Consumpties',
      state: 'consumptions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'consumptions', {
      title: 'Alle Consumpties',
      state: 'consumption-users.list'
    });
  }
]);
