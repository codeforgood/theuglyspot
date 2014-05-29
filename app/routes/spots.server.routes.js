'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var spots = require('../../app/controllers/spots');

	// Spots Routes
	app.route('/spots')
		.get(spots.list)
		.post(users.requiresLogin, spots.create);
	
	app.route('/spots/:spotId')
		.get(spots.read)
		.put(users.requiresLogin, spots.hasAuthorization, spots.update)
	    .delete(users.requiresLogin, spots.hasAuthorization, spots.delete);

	// Finish by binding the Spot middleware
	app.param('spotId', spots.spotByID);
};