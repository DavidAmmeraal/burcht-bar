'use strict';

/**
 * Module dependencies.
 */
require('./consumptions.server.model.js');
require('./payment.server.model.js');
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Consumption = mongoose.model('Consumption'),
  Payment = mongoose.model('Payment'),
  _ = require('underscore');

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
  },
  barcode: {
    type: Number
  }
}, {
  collection: 'users'
});

ConsumptionUserSchema.statics.getConsumed = function(params){
  return new Promise(function(resolve, reject){
    Consumption.aggregate([{
      $match: params
    },{
      $group: {
        _id: '$user',
        consumed: {
          $sum: '$price'
        }
      }
    }], function(err, results){
      if(err){
        reject(err);
      }else{
        resolve(results);
      }
    });

  });
};

ConsumptionUserSchema.statics.getPaid = function(params){
  return new Promise(function(resolve, reject){
    Payment.aggregate([{
      $match: params
    },{
      $group: {
        _id: '$user',
        paid: {
          $sum: '$amount'
        }
      }
    }], function(err, results){
      if(err){
        reject(err);
      }else{
        resolve(results);
      }
    });

  });
};

ConsumptionUserSchema.statics.getUsersWithBalance = function(params, single){
  var model = this.model('ConsumptionUser');
  return new Promise(function(resolve, reject){

    var users = [];
    var aggrParams = {};
    var consumed = [];
    var paid = [];

    var fn = single ? model.findOne : model.find;

    fn.apply(model, [params]).exec().then(function(results, err){
      var barcodes = single ? [results.barcode] : _.map(results, function(result){
        return result.barcode;
      });

      aggrParams = {
        user: {$in: barcodes}
      };

      users = single ? [results] : results;
      return ConsumptionUserSchema.statics.getConsumed(aggrParams);
    }).then(function(results, err){
      consumed = results;
      return ConsumptionUserSchema.statics.getPaid(aggrParams);
    }).then(function(results){
      paid = results;

      console.log(paid);

      users = _.map(users, function(user){

        var userConsumed = _.find(consumed, function(userConsumed){
          return userConsumed._id === user.barcode;
        });

        var userPaid = _.find(paid, function(userPaid){
          return userPaid._id === user.barcode;
        });

        userConsumed = userConsumed ? userConsumed.consumed : 0;
        userPaid = userPaid ? userPaid.paid : 0;

        user = user.toObject();
        user.balance = userPaid - userConsumed;
        return user;
      });

      var returnValue = single ? users[0] : users;
      resolve(returnValue);
    }).catch(function(err){
      reject(err);
    });
  });
};

mongoose.model('ConsumptionUser', ConsumptionUserSchema);
