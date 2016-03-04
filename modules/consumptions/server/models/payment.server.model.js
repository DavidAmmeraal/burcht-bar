'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Consumption Schema
 */
var PaymentSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    default: 0
  },
  user: {
    type: Number,
    required: true
  }
});

mongoose.model('Payment', PaymentSchema);
