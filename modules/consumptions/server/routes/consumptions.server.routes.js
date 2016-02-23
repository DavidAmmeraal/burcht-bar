'use strict';

/**
 * Module dependencies.
 */
var consumptionsPolicy = require('../policies/consumptions.server.policy'),
  basicAuthPolicy = require('../auth/consumptions.basic-auth'),
  consumptions = require('../controllers/consumptions.server.controller');

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

  // Finish by binding the consumption middleware
  app.param('consumptionId', consumptions.consumptionByID);
};
