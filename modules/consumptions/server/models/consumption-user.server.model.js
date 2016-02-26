'use strict';

/**
 * Module dependencies.
 */
require('./consumptions.server.model.js');
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Consumption = mongoose.model('Consumption');

/**
 * Consumption Schema
 */
var ConsumptionUserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: '',
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    default: '',
  },
  username: {
    type: String,
    lowercase: true,
    trim: true
  }
}, {
  collection: 'users'
});

mongoose.model('ConsumptionUser', ConsumptionUserSchema);
