'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Spot = mongoose.model('Spot'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Spot already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Spot
 */
exports.create = function(req, res) {
	var spot = new Spot(req.body);
	spot.user = req.user;

	spot.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(spot);
		}
	});
};

/**
 * Show the current Spot
 */
exports.read = function(req, res) {
	res.jsonp(req.spot);
};

/**
 * Update a Spot
 */
exports.update = function(req, res) {
	var spot = req.spot;

	spot = _.extend(spot, req.body);

	spot.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(spot);
		}
	});
};

/**
 * Delete an Spot
 */
exports.delete = function(req, res) {
	var spot = req.spot;

	spot.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(spot);
		}
	});
};

/**
 * List of Spots
 */
exports.list = function(req, res) {
	Spot.find().sort('-created').populate('user', 'displayName').exec(function(err, spots) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(spots);
		}
	});
};

/**
 * Spot middleware
 */
exports.spotByID = function(req, res, next, id) {
	Spot.findById(id).populate('user', 'displayName').exec(function(err, spot) {
		if (err) return next(err);
		if (!spot) return next(new Error('Failed to load Spot ' + id));
		req.spot = spot;
		next();
	});
};

/**
 * Spot authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.spot.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};