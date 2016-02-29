'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Consumptions Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/consumptions',
      permissions: '*'
    }, {
      resources: '/api/consumptions/:consumptionId',
      permissions: '*'
    }, {
      resources: '/api/consumptions',
      permissions: ['post']
    }]
  }, {
    roles: ['admin', 'user'],
    allows: [{
      resources: '/api/consumption-users',
      permissions: ['get']
    }, {
      resources: '/api/consumption-users/:consumptionUserID',
      permissions: ['get']
    }, {
      resources: '/api/consumption-users/:consumptionUserID/balance',
      permissions: ['get']
    }]
  },{
    roles: ['user'],
    allows: [{
      resources: '/api/consumptions',
      permissions: ['get']
    }, {
      resources: '/api/consumptions/:consumptionId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/consumptions',
      permissions: ['get']
    }, {
      resources: '/api/consumptions/:consumptionId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Consumptions Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  console.log(req.user);
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an consumption is being processed and the current user created it then allow any manipulation
  if (req.consumption && req.user && req.consumption.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
