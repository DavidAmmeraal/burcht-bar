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

  ConsumptionUser.getUsersWithBalance({
    barcode: req.params.barcode
  }, true).then(function(result){
    res.json(result);
  }).catch(function(err){
    res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

  /*
  Consumption.aggregate([{
    $match: {
      $and: [{
        paid: false
      },{
        user: Number(req.params.barcode)
      }]
    }
  }, {
    $group: {
      _id: '$user',
      balance: {
        $sum: '$price'
      }
    }
  }], function(err, result) {
    ConsumptionUser.findOne({barcode: req.params.barcode})
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
  */
};

/**
 * List of Consumptions
 */
exports.list = function(req, res) {
  ConsumptionUser.getUsersWithBalance(req.query).then(function(result){
    res.json(result);
  }).catch(function(err){
    res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
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
