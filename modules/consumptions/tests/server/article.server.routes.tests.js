'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Consumption = mongoose.model('Consumption'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, consumption;

/**
 * Consumption routes tests
 */
describe('Consumption CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new consumption
    user.save(function () {
      consumption = {
        title: 'Consumption Title',
        content: 'Consumption Content'
      };

      done();
    });
  });

  it('should be able to save an consumption if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new consumption
        agent.post('/api/consumptions')
          .send(consumption)
          .expect(200)
          .end(function (consumptionSaveErr, consumptionSaveRes) {
            // Handle consumption save error
            if (consumptionSaveErr) {
              return done(consumptionSaveErr);
            }

            // Get a list of consumptions
            agent.get('/api/consumptions')
              .end(function (consumptionsGetErr, consumptionsGetRes) {
                // Handle consumption save error
                if (consumptionsGetErr) {
                  return done(consumptionsGetErr);
                }

                // Get consumptions list
                var consumptions = consumptionsGetRes.body;

                // Set assertions
                (consumptions[0].user._id).should.equal(userId);
                (consumptions[0].title).should.match('Consumption Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an consumption if not logged in', function (done) {
    agent.post('/api/consumptions')
      .send(consumption)
      .expect(403)
      .end(function (consumptionSaveErr, consumptionSaveRes) {
        // Call the assertion callback
        done(consumptionSaveErr);
      });
  });

  it('should not be able to save an consumption if no title is provided', function (done) {
    // Invalidate title field
    consumption.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new consumption
        agent.post('/api/consumptions')
          .send(consumption)
          .expect(400)
          .end(function (consumptionSaveErr, consumptionSaveRes) {
            // Set message assertion
            (consumptionSaveRes.body.message).should.match('Title cannot be blank');

            // Handle consumption save error
            done(consumptionSaveErr);
          });
      });
  });

  it('should be able to update an consumption if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new consumption
        agent.post('/api/consumptions')
          .send(consumption)
          .expect(200)
          .end(function (consumptionSaveErr, consumptionSaveRes) {
            // Handle consumption save error
            if (consumptionSaveErr) {
              return done(consumptionSaveErr);
            }

            // Update consumption title
            consumption.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing consumption
            agent.put('/api/consumptions/' + consumptionSaveRes.body._id)
              .send(consumption)
              .expect(200)
              .end(function (consumptionUpdateErr, consumptionUpdateRes) {
                // Handle consumption update error
                if (consumptionUpdateErr) {
                  return done(consumptionUpdateErr);
                }

                // Set assertions
                (consumptionUpdateRes.body._id).should.equal(consumptionSaveRes.body._id);
                (consumptionUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of consumptions if not signed in', function (done) {
    // Create new consumption model instance
    var consumptionObj = new Consumption(consumption);

    // Save the consumption
    consumptionObj.save(function () {
      // Request consumptions
      request(app).get('/api/consumptions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single consumption if not signed in', function (done) {
    // Create new consumption model instance
    var consumptionObj = new Consumption(consumption);

    // Save the consumption
    consumptionObj.save(function () {
      request(app).get('/api/consumptions/' + consumptionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', consumption.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single consumption with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/consumptions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Consumption is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single consumption which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent consumption
    request(app).get('/api/consumptions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No consumption with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an consumption if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new consumption
        agent.post('/api/consumptions')
          .send(consumption)
          .expect(200)
          .end(function (consumptionSaveErr, consumptionSaveRes) {
            // Handle consumption save error
            if (consumptionSaveErr) {
              return done(consumptionSaveErr);
            }

            // Delete an existing consumption
            agent.delete('/api/consumptions/' + consumptionSaveRes.body._id)
              .send(consumption)
              .expect(200)
              .end(function (consumptionDeleteErr, consumptionDeleteRes) {
                // Handle consumption error error
                if (consumptionDeleteErr) {
                  return done(consumptionDeleteErr);
                }

                // Set assertions
                (consumptionDeleteRes.body._id).should.equal(consumptionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an consumption if not signed in', function (done) {
    // Set consumption user
    consumption.user = user;

    // Create new consumption model instance
    var consumptionObj = new Consumption(consumption);

    // Save the consumption
    consumptionObj.save(function () {
      // Try deleting consumption
      request(app).delete('/api/consumptions/' + consumptionObj._id)
        .expect(403)
        .end(function (consumptionDeleteErr, consumptionDeleteRes) {
          // Set message assertion
          (consumptionDeleteRes.body.message).should.match('User is not authorized');

          // Handle consumption error error
          done(consumptionDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Consumption.remove().exec(done);
    });
  });
});
