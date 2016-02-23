'use strict';

(function () {
  // Consumptions Controller Spec
  describe('Consumptions Controller Tests', function () {
    // Initialize global variables
    var ConsumptionsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Consumptions,
      mockConsumption;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Consumptions_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Consumptions = _Consumptions_;

      // create mock consumption
      mockConsumption = new Consumptions({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Consumption about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Consumptions controller.
      ConsumptionsController = $controller('ConsumptionsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one consumption object fetched from XHR', inject(function (Consumptions) {
      // Create a sample consumptions array that includes the new consumption
      var sampleConsumptions = [mockConsumption];

      // Set GET response
      $httpBackend.expectGET('api/consumptions').respond(sampleConsumptions);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.consumptions).toEqualData(sampleConsumptions);
    }));

    it('$scope.findOne() should create an array with one consumption object fetched from XHR using a consumptionId URL parameter', inject(function (Consumptions) {
      // Set the URL parameter
      $stateParams.consumptionId = mockConsumption._id;

      // Set GET response
      $httpBackend.expectGET(/api\/consumptions\/([0-9a-fA-F]{24})$/).respond(mockConsumption);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.consumption).toEqualData(mockConsumption);
    }));

    describe('$scope.create()', function () {
      var sampleConsumptionPostData;

      beforeEach(function () {
        // Create a sample consumption object
        sampleConsumptionPostData = new Consumptions({
          title: 'An Consumption about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Consumption about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Consumptions) {
        // Set POST response
        $httpBackend.expectPOST('api/consumptions', sampleConsumptionPostData).respond(mockConsumption);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the consumption was created
        expect($location.path.calls.mostRecent().args[0]).toBe('consumptions/' + mockConsumption._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/consumptions', sampleConsumptionPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock consumption in scope
        scope.consumption = mockConsumption;
      });

      it('should update a valid consumption', inject(function (Consumptions) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/consumptions\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/consumptions/' + mockConsumption._id);
      }));

      it('should set scope.error to error response message', inject(function (Consumptions) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/consumptions\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(consumption)', function () {
      beforeEach(function () {
        // Create new consumptions array and include the consumption
        scope.consumptions = [mockConsumption, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/consumptions\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockConsumption);
      });

      it('should send a DELETE request with a valid consumptionId and remove the consumption from the scope', inject(function (Consumptions) {
        expect(scope.consumptions.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.consumption = mockConsumption;

        $httpBackend.expectDELETE(/api\/consumptions\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to consumptions', function () {
        expect($location.path).toHaveBeenCalledWith('consumptions');
      });
    });
  });
}());
