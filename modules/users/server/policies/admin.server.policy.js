'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');
var User = require('mongoose').model('User');


// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Admin Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/users',
      permissions: '*'
    }, {
      resources: '/api/users/:userId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Admin Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  console.log('isAllowed()');
  var roles = (req.user) ? req.user.roles : ['guest'];
  var checkRolesAllowed = function(){
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


  if(req.headers.authorization){
    var tmp = req.headers.authorization.split(' ');
    var buf = new Buffer(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
    var plainAuth = buf.toString();
    tmp = plainAuth.split(":");
    User.findOne({
      username: tmp[0]
    }, function(err, user){
      if (user && user.authenticate(tmp[1])) {
        roles = user.roles;
        return checkRolesAllowed();
      }
    });
  }else{
    return checkRolesAllowed();
  }
};
