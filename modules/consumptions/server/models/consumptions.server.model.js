'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Consumption Schema
 */
var ConsumptionSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  price: {
    type: Number,
    default: 0.5
  },
  user: {
    type: Number,
    required: true
  }
});

mongoose.model('Consumption', ConsumptionSchema);
