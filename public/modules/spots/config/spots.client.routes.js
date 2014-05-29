'use strict';

//Setting up route
angular.module('spots').config(['$stateProvider',
	function($stateProvider) {
		// Spots state routing
		$stateProvider.
		state('listSpots', {
			url: '/spots',
			templateUrl: 'modules/spots/views/list-spots.client.view.html'
		}).
		state('createSpot', {
			url: '/spots/create',
			templateUrl: 'modules/spots/views/create-spot.client.view.html'
		}).
		state('viewSpot', {
			url: '/spots/:spotId',
			templateUrl: 'modules/spots/views/view-spot.client.view.html'
		}).
		state('editSpot', {
			url: '/spots/:spotId/edit',
			templateUrl: 'modules/spots/views/edit-spot.client.view.html'
		});
	}
]);