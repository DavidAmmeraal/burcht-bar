'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ConsumptionUser = mongoose.model('ConsumptionUser'),
  Consumption = mongoose.model('Consumption'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a consumption
 */
exports.create = function(req, res) {
  Consumption.create(req.body, function(err, consumptions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(consumptions);
    }
  });

};

/**
 * Show the current consumption
 */
exports.read = function(req, res) {
  res.json(req.consumption);
};

/**
 * Update a consumption
 */
exports.update = function(req, res) {
  var consumption = req.consumption;

  consumption.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(consumption);
    }
  });
};

/**
 * Delete an consumption
 */
exports.delete = function(req, res) {
  var consumption = req.consumption;

  consumption.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(consumption);
    }
  });
};

/**
 * List of Consumptions
 */
exports.list = function(req, res) {
  Consumption.find(req.query).populate('user').exec(function(err, consumptions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(consumptions);
    }
  });
};

/**
 * Consumption middleware
 */
exports.consumptionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Consumption is invalid'
    });
  }

  Consumption.findById(id).populate('user', 'displayName').exec(function(err, consumption) {
    if (err) {
      return next(err);
    } else if (!consumption) {
      return res.status(404).send({
        message: 'No consumption with that identifier has been found'
      });
    }
    req.consumption = consumption;
    next();
  });
};
