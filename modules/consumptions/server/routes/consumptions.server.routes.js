'use strict';

/**
 * Module dependencies.
 */
var consumptionsPolicy = require('../policies/consumptions.server.policy'),
  basicAuthPolicy = require('../auth/consumptions.basic-auth'),
  consumptions = require('../controllers/consumptions.server.controller'),
  consumptionUsers = require('../controllers/consumption-users.server.controller'),
  payments = require('../controllers/payment.server.controller.js');

module.exports = function (app) {
  // Consumptions collection routes
  app.route('/api/consumptions').all(basicAuthPolicy.isAllowed, consumptionsPolicy.isAllowed)
    .get(consumptions.list)
    .post(consumptions.create);

  // Single consumption routes
  app.route('/api/consumptions/:consumptionId').all(consumptionsPolicy.isAllowed)
    .get(consumptions.read)
    .put(consumptions.update)
    .delete(consumptions.delete);

  app.route('/api/consumption-users').all(consumptionsPolicy.isAllowed)
    .get(consumptionUsers.list);

  app.route('/api/consumption-users/:barcode').all(consumptionsPolicy.isAllowed)
    .get(consumptionUsers.read);

  app.route('/api/payments').all(consumptionsPolicy.isAllowed)
    .get(payments.list)
    .post(payments.create);

  app.route('/api/payments/:paymentId').all(consumptionsPolicy.isAllowed)
    .get(payments.read);

  // Finish by binding the consumption middleware
  app.param('consumptionId', consumptions.consumptionByID);
  app.param('consumptionUserId', consumptionUsers.userByID);
  app.param('paymentId', payments.paymentByID);
  //app.param('userId', consumptionUsers.userById);
};
