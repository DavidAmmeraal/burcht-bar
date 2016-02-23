'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  BasicStrategy = require('passport-http').BasicStrategy,
  User = require('mongoose').model('User');

module.exports = function(config) {
  // Use facebook strategy
  passport.use(new BasicStrategy(
    function(username, password, done) {
      console.log('LET try and authenticate!');
      User.findOne({
        username: username
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (!user || !user.authenticate(password)) {
          return done(null, false);
        }
        return done(null, user);
      });
    }
  ));
};
