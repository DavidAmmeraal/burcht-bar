'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  _ = require('underscore'),
  Consumption = mongoose.model('Consumption'),
  ConsumptionUser = mongoose.model('ConsumptionUser'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current consumption
 */
exports.read = function(req, res) {
  console.log(req.params);
  Consumption.aggregate([{
    $match: {
      user: mongoose.Types.ObjectId(req.params.consumptionUserID),
      paid: false
    }
  }, {
    $group: {
      _id: req.params.consumptionUserID,
      balance: {
        $sum: '$price'
      }
    }
  }], function(err, result) {
    ConsumptionUser.findOne({
        _id: req.params.consumptionUserID
      })
      .exec(function(err, user) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {

          user = user.toObject();
          user = _.extend(user, result[0]);
          res.json(user);
        }
      });
  });
};

/**
 * List of Consumptions
 */
exports.list = function(req, res) {
  ConsumptionUser.find().exec(function(err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var ids = _.pluck(users, '_id');

      Consumption.aggregate([{
        $match: {
          $and: [{
            paid: false
          }, {
            user: {
              $in: ids
            }
          }]

        }
      }, {
        $group: {
          _id: '$user',
          balance: {
            $sum: "$price"
          }
        }
      }], function(err, results) {
        users = users.map(function(user) {
          user = user.toObject();
          var balanceObj = _.find(results, function(result) {
            return result._id.equals(user._id);
          });

          if (balanceObj.balance) {
            user.balance = balanceObj.balance;
          }
          return user;
        });
        res.json(users);
      });
    }
  });
};

/**
 * Consumption middleware
 */
exports.userByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Consumption is invalid'
    });
  }

  ConsumptionUser.findById(id).populate('consumptions').exec(function(err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return res.status(404).send({
        message: 'No consumption with that identifier has been found'
      });
    }
    req.user = user;
    next();
  });
};
