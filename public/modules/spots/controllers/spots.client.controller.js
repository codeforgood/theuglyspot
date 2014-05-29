'use strict';

// Spots controller
angular.module('spots').controller('SpotsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Spots',
    function($scope, $stateParams, $location, Authentication, Spots) {
        $scope.authentication = Authentication;

        // Create new Spot
        $scope.create = function() {
        	// Create new Spot object
            var spot = new Spots({
                name: this.name
            });

            // Redirect after save
            spot.$save(function(response) {
                $location.path('spots/' + response._id);
            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

            // Clear form fields
            this.name = '';
        };

        // Remove existing Spot
        $scope.remove = function(spot) {
            if (spot) {
                spot.$remove();

                for (var i in $scope.spots) {
                    if ($scope.spots[i] === spot) {
                        $scope.spots.splice(i, 1);
                    }
                }
            } else {
                $scope.spot.$remove(function() {
                    $location.path('spots');
                });
            }
        };

        // Update existing Spot
        $scope.update = function() {
            var spot = $scope.spot;

            spot.$update(function() {
                $location.path('spots/' + spot._id);
            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
        };

        // Find a list of Spots
        $scope.find = function() {
            $scope.spots = Spots.query();
        };

        // Find existing Spot
        $scope.findOne = function() {
            $scope.spot = Spots.get({
                spotId: $stateParams.spotId
            });
        };
    }
]);