'use strict';
var User = require('mongoose').model('User');


exports.isAllowed = function(req, res, next){
  if(req.headers.authorization){
    var tmp = req.headers.authorization.split(' ');
    var buf = new Buffer(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
    var plainAuth = buf.toString();
    tmp = plainAuth.split(":");
    User.findOne({
      username: tmp[0]
    }, function(err, user){
      if (user && user.authenticate(tmp[1])) {
        req.user = user;
        next();
      }else{
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    });
  }
};
