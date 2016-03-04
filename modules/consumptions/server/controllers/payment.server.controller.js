'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Payment = mongoose.model('Payment'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a payment
 */
exports.create = function(req, res) {
  Payment.create(req.body, function(err, payments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(payments);
    }
  });

};

/**
 * Show the current payment
 */
exports.read = function(req, res) {
  res.json(req.payment);
};

/**
 * List of Consumptions
 */
exports.list = function(req, res) {
  Payment.find(req.query).exec(function(err, payments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(payments);
    }
  });
};

/**
 * Consumption middleware
 */
exports.paymentByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Consumption is invalid'
    });
  }

  Payment.findById(id).exec(function(err, payment) {
    if (err) {
      return next(err);
    } else if (!payment) {
      return res.status(404).send({
        message: 'No payment with that identifier has been found'
      });
    }
    req.payment = payment;
    next();
  });
};
