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
  paid:{
    type: Boolean,
    default: false
  },
  paidOn: {
    type: Date,
    default: null
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Consumption', ConsumptionSchema);
