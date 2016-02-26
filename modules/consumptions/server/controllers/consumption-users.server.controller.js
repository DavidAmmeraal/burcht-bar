'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ConsumptionUser = mongoose.model('ConsumptionUser'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current consumption
 */
exports.read = function (req, res) {
  res.json(req.consumption);
};

/**
 * List of Consumptions
 */
exports.list = function (req, res) {
  console.log("LIST!");
  ConsumptionUser.find().exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(users);
    }
  });
};

/**
 * Consumption middleware
 */
exports.userByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Consumption is invalid'
    });
  }

  ConsumptionUser.findById(id).populate('consumptions').exec(function (err, user) {
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
