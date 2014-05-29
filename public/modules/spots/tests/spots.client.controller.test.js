'use strict';

(function() {
	// Spots Controller Spec
	describe('Spots Controller Tests', function() {
		// Initialize global variables
		var SpotsController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Spots controller.
			SpotsController = $controller('SpotsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Spot object fetched from XHR', inject(function(Spots) {
			// Create sample Spot using the Spots service
			var sampleSpot = new Spots({
				name: 'New Spot'
			});

			// Create a sample Spots array that includes the new Spot
			var sampleSpots = [sampleSpot];

			// Set GET response
			$httpBackend.expectGET('spots').respond(sampleSpots);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.spots).toEqualData(sampleSpots);
		}));

		it('$scope.findOne() should create an array with one Spot object fetched from XHR using a spotId URL parameter', inject(function(Spots) {
			// Define a sample Spot object
			var sampleSpot = new Spots({
				name: 'New Spot'
			});

			// Set the URL parameter
			$stateParams.spotId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/spots\/([0-9a-fA-F]{24})$/).respond(sampleSpot);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.spot).toEqualData(sampleSpot);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Spots) {
			// Create a sample Spot object
			var sampleSpotPostData = new Spots({
				name: 'New Spot'
			});

			// Create a sample Spot response
			var sampleSpotResponse = new Spots({
				_id: '525cf20451979dea2c000001',
				name: 'New Spot'
			});

			// Fixture mock form input values
			scope.name = 'New Spot';

			// Set POST response
			$httpBackend.expectPOST('spots', sampleSpotPostData).respond(sampleSpotResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Spot was created
			expect($location.path()).toBe('/spots/' + sampleSpotResponse._id);
		}));

		it('$scope.update() should update a valid Spot', inject(function(Spots) {
			// Define a sample Spot put data
			var sampleSpotPutData = new Spots({
				_id: '525cf20451979dea2c000001',
				name: 'New Spot'
			});

			// Mock Spot in scope
			scope.spot = sampleSpotPutData;

			// Set PUT response
			$httpBackend.expectPUT(/spots\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/spots/' + sampleSpotPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid spotId and remove the Spot from the scope', inject(function(Spots) {
			// Create new Spot object
			var sampleSpot = new Spots({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Spots array and include the Spot
			scope.spots = [sampleSpot];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/spots\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSpot);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.spots.length).toBe(0);
		}));
	});
}());